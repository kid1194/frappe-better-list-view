# Frappe Better List View © 2022
# Author:  Ameen Ahmed
# Company: Level Up Marketing & Software Development Services
# Licence: Please refer to LICENSE file


from setuptools import setup, find_packages
from frappe_better_list_view import __version__ as version


with open('requirements.txt') as f:
    install_requires = f.read().strip().split('\n')


setup(
    name='frappe_better_list_view',
    version=version,
    description='Frappe list view that allows setting the number of rows per page and the list of fields to fetch without displaying their values.',
    author='Ameen Ahmed (Level Up)',
    author_email='kid1194@gmail.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
