import { driver } from "driver.js";
// @ts-expect-error
import "driver.js/dist/driver.css";
// @ts-expect-error
import "./tour.css";

export function startHomeTour() {
    const driverObj = driver({
        showProgress: true,
        steps: [
            {
                popover: {
                    title: "Welcome to Drone CAD",
                    description: "Let's take a quick tour of the new features available.",
                },
            },
            {
                element: "#tour-new-document",
                popover: {
                    title: "Start from Scratch",
                    description:
                        "Click here to create a new empty document and start designing from scratch.",
                    side: "right",
                    align: "start",
                },
            },
            {
                element: "#tour-get-started",
                popover: {
                    title: "Get Started Templates",
                    description:
                        "Or, select one of these pre-built templates to hit the ground running! Clicking one will open the editor with the model ready to go.",
                    side: "bottom",
                    align: "start",
                },
            },
            {
                popover: {
                    title: "Component Library",
                    description:
                        "Once you open a template or a new document, you'll find a new 'Components' tab in the top ribbon. You can use it to instantly drop motors, propellers, and batteries right into your scene!",
                },
            },
        ],
    });

    driverObj.drive();
}
