import { Store }from "../models/store.model.js";
//import User from "../models/User.js"; // if you use User model for reference
import { Country, ShippingRate  } from "../models/country.model.js";

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

// Receives a store URL from the request and returns default shipping details, including shipping service, fees, delivery times, and return policy.
export const getStoreDefaultShippingDetails = async (req, res) => {
  const { storeUrl } = req.params;

  try {
    if (!storeUrl) {
      return res.status(400).json({ error: 'Store URL is required.' });
    }

    const store = await Store.findOne({ url: storeUrl }).select({
      defaultShippingService: 1,
      defaultShippingFeePerItem: 1,
      defaultShippingFeeForAdditionalItem: 1,
      defaultShippingFeePerKg: 1,
      defaultShippingFeeFixed: 1,
      defaultDeliveryTimeMin: 1,
      defaultDeliveryTimeMax: 1,
      returnPolicy: 1,
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error fetching store shipping details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Receives a store URL and new shipping details from the request, and updates the store’s default shipping info including service, fees, delivery times, and return policy.
export const updateStoreDefaultShippingDetails = async (req, res) => {
  const { storeUrl } = req.params;
  const details = req.body;
  const userId = req.auth;

  const user = req.user; 

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    if (user.privateMetadata?.role !== 'SELLER') {
      return res.status(403).json({
        error: 'Unauthorized Access: Seller Privileges Required for Entry.',
      });
    }

    if (!storeUrl) {
      return res.status(400).json({ error: 'Store URL is required.' });
    }

    if (!details || Object.keys(details).length === 0) {
      return res.status(400).json({ error: 'No shipping details provided to update.' });
    }

    //Check ownership
    const store = await Store.findOne({ url: storeUrl, userId: userId });

    if (!store) {
      return res.status(403).json({
        error: 'Make sure you have the permissions to update this store.',
      });
    }

    // Update the store
    const updatedStore = await Store.findOneAndUpdate(
      { url: storeUrl },
      { $set: details },
      { new: true }
      
    ).select({
      // check them below
      defaultShippingService: 1,
      defaultShippingFeePerItem: 1,
      defaultShippingFeeForAdditionalItem: 1,
      defaultShippingFeePerKg: 1,
      defaultShippingFeeFixed: 1,
      defaultDeliveryTimeMin: 1,
      defaultDeliveryTimeMax: 1,
      returnPolicy: 1,
    });

    return res.json(updatedStore);
  } catch (error) {
    console.error('Error updating shipping details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
// Retrieves all countries and their shipping rates for a specific store; includes countries without rates (with null shippingRate), and returns a list sorted by country name.
export const getStoreShippingRates = async (req, res) => {
  const { storeUrl } = req.params;
  const user = req.user;

  try {

    if (user.privateMetadata?.role !== 'SELLER') {
      return res.status(403).json({
        error: 'Unauthorized Access: Seller Privileges Required for Entry.',
      });
    }

    if (!storeUrl) {
      return res.status(400).json({ error: 'Store URL is required.' });
    }

    // Ownership check
    const store = await Store.findOne({ url: storeUrl });
    // const store = await Store.findOne({ url: storeUrl, userId: user._id });

    if (!store) {
      return res.status(403).json({
        error: 'Make sure you have the permissions to update this store.',
      });
    }

    // Fetch countries (sorted)
    const countries = await Country.find().sort({ name: 1 }).lean();

    // Fetch shipping rates for the store
    const shippingRates = await ShippingRate.find({ storeId: store._id }).lean();

    // Map shipping rates by countryId
    const rateMap = new Map();
    shippingRates.forEach((rate) => {
      rateMap.set(rate.countryId.toString(), rate);
    });

    // Combine countries with rates
    const result = countries.map((country) => ({
      countryId: country._id,
      countryName: country.name,
      shippingRate: rateMap.get(country._id.toString()) || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error retrieving store shipping rates:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
// Receives a store URL and shipping rate details, and upserts the rate for a specific country—updating if it exists or creating a new one if not; returns the updated or newly created rate
export const upsertShippingRate = async (req, res) => {
  const { storeUrl } = req.params;
  const shippingRate = req.body;
  const userId = req.auth;

  try {
    // Auth
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    if (user.privateMetadata?.role !== 'SELLER') {
      return res.status(403).json({
        error: 'Unauthorized Access: Seller Privileges Required for Entry.',
      });
    }

    if (!storeUrl) {
      return res.status(400).json({ error: 'Store URL is required.' });
    }

    if (!shippingRate || typeof shippingRate !== 'object') {
      return res.status(400).json({ error: 'Please provide shipping rate data.' });
    }

    if (!shippingRate.countryId) {
      return res.status(400).json({ error: 'Please provide a valid country ID.' });
    }

    // Check ownership and get store
    const store = await Store.findOne({ url: storeUrl });
    // const store = await Store.findOne({ url: storeUrl, userId: user.id });

    if (!store) {
      return res.status(403).json({
        error: 'Make sure you have the permissions to update this store.',
      });
    }

    const filter = shippingRate.id
      ? { _id: shippingRate.id, storeId: store._id }
      : { storeId: store._id, countryId: shippingRate.countryId };

      const update = {
      storeId: store._id,
      countryId: shippingRate.countryId,
      shippingService: shippingRate.shippingService,
      shippingFeePerItem: shippingRate.shippingFeePerItem,
      shippingFeeForAdditionalItem: shippingRate.shippingFeeForAdditionalItem,
      shippingFeePerKg: shippingRate.shippingFeePerKg,
      shippingFeeFixed: shippingRate.shippingFeeFixed,
      deliveryTimeMin: shippingRate.deliveryTimeMin,
      deliveryTimeMax: shippingRate.deliveryTimeMax,
      returnPolicy: shippingRate.returnPolicy,
    };

    const upserted = await ShippingRate.findOneAndUpdate(
      filter,
      update,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(upserted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};