const fs = require('fs');
const path = require('path');

/**
 * Generates API documentation by inspecting routes and models.
 */
const generateAPIDocumentation = () => {
  // Path to the routes file
  const routesFilePath = path.join(__dirname, '../routes/chatRoutes.js');

  // Read the routes file
  fs.readFile(routesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading routes file:', err);
      return;
    }

    // Placeholder for extracted route information
    const routes = [];

    // Regular expression to match route definitions in the routes file
    const routeRegex = /router\.(\w+)\('([\w\/]+)',/g;

    let match;
    // Extract route method and path
    while ((match = routeRegex.exec(data)) !== null) {
      const method = match[1]; // GET, POST, etc.
      const path = match[2]; // Route path

      // Add to routes array
      routes.push({ method, path });
    }

    console.log('Extracted Routes:', routes);

    // New functionality to handle model schemas
    generateModelDocumentation();
  });
};

/**
 * Generates documentation for model schemas.
 */
const generateModelDocumentation = () => {
  const modelsPath = path.join(__dirname, '../models');
  fs.readdir(modelsPath, (err, files) => {
    if (err) {
      console.error('Error reading models directory:', err);
      return;
    }

    files.forEach(file => {
      const modelPath = path.join(modelsPath, file);
      fs.readFile(modelPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading model file (${file}):`, err);
          return;
        }

        // Simplified example of extracting model schema information
        // This assumes models are defined in a way that allows easy extraction
        // For a more robust solution, consider using a library or tool capable of parsing JSDoc comments or a specific schema definition format
        const modelName = file.replace('.js', '');
        console.log(`Model: ${modelName}`);
        console.log('Fields:');

        const fieldRegex = /"(\w+)"\s+TEXT|INTEGER/g;
        let match;
        while ((match = fieldRegex.exec(data)) !== null) {
          console.log(`- ${match[1]}`);
        }
      });
    });
  });
};

module.exports = { generateAPIDocumentation };