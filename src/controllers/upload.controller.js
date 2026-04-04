const uploadImage = (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "Image file is required" });
    return;
  }

  res.status(201).json({
    fileName: req.file.filename,
    imageUrl: `/uploads/${req.file.filename}`
  });
};

module.exports = {
  uploadImage
};
