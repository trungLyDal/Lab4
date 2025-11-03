# Lab 4

* *Date Created*: 31 10 2025
* *Last Modification Date*: 02 11 2025
* *Lab Netlify URL*: https://reciperecommender123.netlify.app/
* *GitLab URL*: https://git.cs.dal.ca/tly/csci-3172/-/tree/main/labs/lab4

## Authors

If what is being submitted is an individual Lab or Assignment, you may simply include your name and email address. Otherwise list the members of your group.

* [Jun Ly](tr228214@dal.ca)

## Properly cite your work by including a brief description of the application  you have created, along with the list of APIs and other technologies used, and a brief mention of 
any issues or limitations you encountered along the way and how you addressed them (if you were 
able to). 

* Brief Description:
- This application takes in your dietary restrictions and 1 single ingredient and give you recipes based on them.

* Issues: 
- The website of TheMealDB has APIs but it does not categorized based off of dietary restrictions. Which when i set vegan/vegetarian, meat dishes were also returned. 
- Secondly, when I searched up lettuce and vegetarian, dishes with lettuce and meat were being returned as well.

- To solve this, filtering is a large part of this application in server.js (Server side filtering). It goes through Whitelist, Conflict list, and filter out the recipe name to ensure that no error got through. This will create a strong filter where no ambiguous names will bypass.


## Built With
HTML, CSS, JS
Backend: Node.js
API: TheMealDB

## Testing
- I used alt text for images, sematic HTML tags to ensure best practices for WCAG. 
- I separated server and client side test. Which creates a scalable and dynamic testing environment.
- Every test works as expected: 
Server side tests: npm run test:server
Client side tests: npm test

## To run server: 
- node server.js


## Sources Used
https://www.themealdb.com/
https://stackoverflow.com/questions/54535511/javascript-to-allow-a-whitelist-of-url-arguments-only



## Acknowledgments
https://stackoverflow.com/questions/54535511/javascript-to-allow-a-whitelist-of-url-arguments-only
https://www.themealdb.com/




