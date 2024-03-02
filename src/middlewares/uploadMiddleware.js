const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null,  uniqueSuffix + '-' + file.originalname)
//     }
//   })
	const storage = multer.memoryStorage({
		limit: {
			fileSize: 2000000,
		}
	})
	const upload = multer({ storage: storage });

// const upload = multer({
//     dest: "public/uploads"
// })

// const uploadFile = () => {

// }

module.exports = { upload };
