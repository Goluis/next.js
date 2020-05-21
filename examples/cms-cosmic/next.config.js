require('dotenv').config()

module.exports = {
  env: {
    NEXT_EXAMPLE_CMS_COSMIC_BUCKET_SLUG:
      process.env.NEXT_EXAMPLE_CMS_COSMIC_BUCKET_SLUG,
    NEXT_EXAMPLE_CMS_COSMIC_READ_KEY:
      process.env.NEXT_EXAMPLE_CMS_COSMIC_READ_KEY,
    NEXT_EXAMPLE_CMS_COSMIC_PREVIEW_SECRET:
      process.env.NEXT_EXAMPLE_CMS_COSMIC_PREVIEW_SECRET,
  },
}
