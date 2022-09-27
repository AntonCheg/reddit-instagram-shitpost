"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const instagram_private_api_1 = require("instagram-private-api");
(0, dotenv_1.config)();
const ig = new instagram_private_api_1.IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);
const main = async () => {
    const logged = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    const userFeed = ig.feed.user(logged.pk);
    const myPostsFirstPage = await userFeed.items();
    // All the feeds are auto-paginated, so you just need to call .items() sequentially to get next page
    const myPostsSecondPage = await userFeed.items();
    console.log(myPostsFirstPage, myPostsSecondPage);
};
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWdDO0FBQ2hDLGlFQUFvRDtBQUVwRCxJQUFBLGVBQU0sR0FBRSxDQUFDO0FBQ1QsTUFBTSxFQUFFLEdBQUcsSUFBSSxtQ0FBVyxFQUFFLENBQUM7QUFFN0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFZLENBQUMsQ0FBQztBQUVsRCxNQUFNLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtJQUN0QixNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQ3hCLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFekMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoRCxvR0FBb0c7SUFDcEcsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVqRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDbkQsQ0FBQyxDQUFDO0FBRUYsSUFBSSxFQUFFLENBQUMifQ==