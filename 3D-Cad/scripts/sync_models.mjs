import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// We now use public/models as the definitive source of truth!
// This way, the models are tracked by Git and can be deployed to Render.
const modelsDir = path.resolve(rootDir, "public", "models");

const isModelFile = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return [".step", ".stp", ".stl", ".iges", ".igs", ".brep"].includes(ext);
};

async function syncModels() {
    console.log("Generating manifest from:", modelsDir);

    // Ensure models directory exists just in case
    await fs.mkdir(modelsDir, { recursive: true });

    const manifest = {
        templates: [],
        components: {},
    };

    try {
        const items = await fs.readdir(modelsDir, { withFileTypes: true });

        for (const item of items) {
            if (item.isFile()) {
                if (isModelFile(item.name)) {
                    // Top-level files are Templates
                    const nameWithoutExt = path.parse(item.name).name;
                    let imagePath = null;

                    // Check for corresponding image
                    for (const ext of [".png", ".jpg", ".jpeg"]) {
                        const possibleImg = nameWithoutExt + ext;
                        try {
                            await fs.access(path.join(modelsDir, possibleImg));
                            imagePath = `models/${possibleImg}`;
                            break;
                        } catch (e) {
                            // Image doesn't exist, ignore
                        }
                    }

                    manifest.templates.push({
                        id: item.name,
                        name: nameWithoutExt,
                        file: `models/${item.name}`,
                        image: imagePath,
                    });
                }
            } else if (item.isDirectory()) {
                // Subdirectories are component categories
                const categoryName = item.name;
                const categoryDir = path.join(modelsDir, categoryName);

                // Read files inside category
                const subItems = await fs.readdir(categoryDir, { withFileTypes: true });
                const categoryModels = [];

                for (const subItem of subItems) {
                    if (subItem.isFile() && isModelFile(subItem.name)) {
                        const nameWithoutExt = path.parse(subItem.name).name;
                        let imagePath = null;

                        // Check for corresponding image
                        for (const ext of [".png", ".jpg", ".jpeg"]) {
                            const possibleImg = nameWithoutExt + ext;
                            try {
                                await fs.access(path.join(categoryDir, possibleImg));
                                imagePath = `models/${categoryName}/${possibleImg}`;
                                break;
                            } catch (e) {
                                // Ignore
                            }
                        }

                        categoryModels.push({
                            id: `${categoryName}/${subItem.name}`,
                            name: nameWithoutExt,
                            file: `models/${categoryName}/${subItem.name}`,
                            image: imagePath,
                        });
                    }
                }

                if (categoryModels.length > 0) {
                    if (categoryName.toLowerCase() === "templates") {
                        manifest.templates.push(...categoryModels);
                    } else {
                        manifest.components[categoryName] = categoryModels;
                    }
                }
            }
        }

        // Write manifest
        await fs.writeFile(path.join(modelsDir, "manifest.json"), JSON.stringify(manifest, null, 2));
        console.log("Manifest written successfully!");
    } catch (err) {
        console.error("Error generating manifest:", err);
    }
}

syncModels();
