const express = require('express');
const predictRoutes = require('./routes/predictRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/predict', predictRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
