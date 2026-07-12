import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Drone_web.settings')
django.setup()

from content.models import PocItem

pocs = [
    {
        "title": "Solar Powered Vertical Take-Off and Landing (VTOL)",
        "description": "The development of a Solar Powered Vertical Take-Off and Landing (VTOL) drone represents a significant step toward achieving sustainable and energy-efficient unmanned aerial systems. Unlike conventional drones that rely solely on battery power, the proposed design integrates flexible solar panels onto the wings to harness renewable solar energy for in-flight battery charging and endurance enhancement.\n\nA VTOL configuration was selected to combine the advantages of rotary-wing hovering and fixed-wing forward flight, ensuring both operational flexibility and extended range. Initial tests demonstrated that flexible solar panels could successfully recharge the onboard battery, compensating for energy consumption during flight. Due to the larger size of the panels, scaling the VTOL platform is suggested to achieve optimal integration and improved energy capture.\n\nThis approach not only reduces dependency on ground-based charging infrastructure but also opens pathways for long-duration missions in applications such as environmental monitoring, surveillance, disaster management, and precision agriculture. The concept highlights the potential of merging renewable energy technology with UAV systems, contributing to the advancement of green aviation solutions.",
        "image": "pocs/poc1.png",
        "order": 1,
    },
    {
        "title": "Immersive Drone Flight Simulator",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras vehicula diam vitae est consequat, nec fermentum arcu pharetra. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
        "image": "pocs/poc2.jpg",
        "order": 2,
    },
    {
        "title": "3D CAD Modeling & Drone Design",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Vestibulum id ligula porta felis euismod semper. Nulla vitae elit libero, a pharetra augue.",
        "image": "pocs/poc3.jpg",
        "order": 3,
    }
]

for item in pocs:
    PocItem.objects.update_or_create(
        title=item["title"],
        defaults={
            "description": item["description"],
            "main_image": item["image"],
            "order": item["order"],
        }
    )

print("PoCs seeded successfully!")
