
export const generateUniqueSlug = async (baseSlug, model, field = "slug", separator = "-") => {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingRecord = await model.findOne({ [field]: slug });

    if (!existingRecord) {
      break;
    }

    slug = `${baseSlug}${separator}${suffix}`;
    suffix += 1;
  }

  return slug;
};