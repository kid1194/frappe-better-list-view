# Frappe Better List View © 2023
# Author:  Ameen Ahmed
# Company: Level Up Marketing & Software Development Services
# Licence: Please refer to LICENSE file


from frappe import _


def get_data():
    return [
        {
            "module_name": "Frappe Better List View",
            "color": "blue",
            "icon": "octicon octicon-list-unordered",
            "type": "module",
            "label": _("Frappe Better List View")
        }
    ]