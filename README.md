# The DFYLinks Custom Checkout & Order System

At DFYLinks (now GetMeLinks) we were looking to solve the current inneficient system of having clients send us ambiguous spreadsheets for their order. Instead we decided that we could have the *exact* set inputs that we needed as a business to fufill the order. This completely removed back and forth emails, especially with new customers.

The Checkout knows what items are in the basket and what to ask the user for inputs we needed.

This was somewhat "hacked" together by me in an untraditional sense as this was already very large E-Commerce site when I joined and was running a theme that caused havoc when trying to build any hooks on it, so I took on the challenge and edited core files in both the theme and the WooCommerce files themselves in order to make this work, along with GScripting (Googles language) to deploy the order note onto a Google Drive folder for admin use.

## Features

- Asks for specific input depending on the product.
- Beautiful UI that customers found incredibly easy to navigate
- Full validation for duplicates, non URLs etc.
- Option for orders over $1,500 to have the company do their anchor texts for them
- Compiles all the input from the user into a report that's downloaded locally for the clients reference.
- Also uploads that file to a Google Drive folder so that the order may be fufilled by admin.
- Little features such as "auto fill" in forms for repetitive typing on bigger orders, press enter for the next panel etc.


## Further Notes
- Built using ES6, JQuery and PHP, SASS, CSS and GScript.
- All testing was done by myself in order to prevent exploits and losses for the company.
- Again back end code is on a computer in london for the time being, once I have access I will upload.

## Video Demo!

[![Watch the video](https://img.youtube.com/vi/I-D-jXqDA8A/hqdefault.jpg)](https://youtu.be/I-D-jXqDA8A)



