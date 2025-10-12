import { Store }from "../models/store.model.js";
//import User from "../models/User.js"; // if you use User model for reference

// upsertStore controller
export const upsertStore = async (req, res) => {
  const { userId } = req.auth; 
  try {
    const user = req.user; // assume middleware adds authenticated user

    // Ensure user is authenticated
    if (!user) throw new Error("401: Unauthenticated.");

    // Verify seller permission
    if (user.role !== "SELLER")
      throw new Error("403: Unauthorized Access — Seller privileges required.");

    const store = req.body;

    // Ensure store data is provided
    if (!store) throw new Error("400: Please provide store data.");

    // Check for existing store with same name, url, email, or phone
    const existingStore = await Store.findOne({
      $and: [
        {
          $or: [
            { name: store.name },
            { url: store.url },
            { email: store.email },
            { phone: store.phone },
          ],
        },
        { _id: { $ne: store._id } }, // exclude current one if updating
      ],
    });

    // Handle duplicates
    if (existingStore) {
      let message = "";
      if (existingStore.name === store.name)
        message = "A store with the same name already exists.";
      else if (existingStore.email === store.email)
        message = "A store with the same email already exists.";
      else if (existingStore.phone === store.phone)
        message = "A store with the same phone number already exists.";
      else if (existingStore.url === store.url)
        message = "A store with the same URL already exists.";
      throw new Error("409: " + message);
    }

    // Upsert logic — create if no _id, otherwise update
    let updatedStore;
    if (store._id) {
      updatedStore = await Store.findByIdAndUpdate(store._id, store, {
        new: true,
        runValidators: true,
      });
    } else {
      updatedStore = await Store.create({
        ...store,
        userId: userId ,
      });
    }

    res.status(200).json(updatedStore);
  } catch (err) {
    console.error("Error in upsertStore:", err.message);

    // Extract status code if included in message like "401: message"
    const parts = err.message.split(":");
    const maybeStatus = parseInt(parts[0]);
    const hasStatus = !isNaN(maybeStatus);

    const status = hasStatus ? maybeStatus : 500;
    const message = hasStatus ? parts.slice(1).join(":").trim() : err.message;

    res.status(status).json({ message });
  }
};

export const getStoresByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const stores = await Store.find({ userId });

    if (!stores.length) {
      return res.status(404).json({ message: "No stores found for this user" });
    }

    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStoreByUrl = async (req, res) => {
  try {
    const { storeUrl } = req.params;

    // Find store by its URL
    const storeDetails = await Store.findOne({ url: storeUrl });

    if (!storeDetails) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(storeDetails);
  } catch (error) {
    console.error("Error fetching store details:", error);
    res.status(500).json({ message: "Server error" });
  }
};