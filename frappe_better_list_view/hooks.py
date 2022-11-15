# Frappe Better List View © 2022
# Author:  Ameen Ahmed
# Company: Level Up Marketing & Software Development Services
# Licence: Please refer to LICENSE file


from . import __version__ as app_version
from frappe import __version__ as frappe_version


app_name = "frappe_better_list_view"
app_title = "Frappe Better List View"
app_publisher = "Ameen Ahmed (Level Up)"
app_description = "Frappe list view that allows setting the number of rows per page and the list of fields to fetch without displaying their values."
app_icon = "octicon octicon-list-unordered"
app_color = "blue"
app_email = "kid1194@gmail.com"
app_license = "MIT"


is_frappe_above_v13 = int(frappe_version.split('.')[0]) > 13


app_include_js = [
    'better_list_view.bundle.js'
] if is_frappe_above_v13 else [
    '/assets/frappe_better_list_view/js/better_list_view.js'
]