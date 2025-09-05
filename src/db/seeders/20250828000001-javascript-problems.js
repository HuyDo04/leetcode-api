'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Create Languages (JavaScript from Judge0)
        await queryInterface.bulkInsert('languages', [
            {
                id: 1,
                name: 'JavaScript (Node.js 12.14.0)',
                judge0_id: 63,
                slug: 'javascript',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                name: 'Python (3.8.1)',
                judge0_id: 71,
                slug: 'python',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 2. Create JavaScript Category
        await queryInterface.bulkInsert('categories', [
            {
                id: 1,
                name: 'JavaScript',
                slug: 'javascript',
                icon: 'code',
                text: 'JS',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 3. Create Tags
        await queryInterface.bulkInsert('tags', [
            {
                id: 1,
                name: 'Array',
                slug: 'array',
                count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                name: 'String',
                slug: 'string',
                count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 3,
                name: 'Math',
                slug: 'math',
                count: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 4,
                name: 'Sorting',
                slug: 'sorting',
                count: 0,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 4. Create JavaScript Problems
        await queryInterface.bulkInsert('problems', [
            // Array Problems
            {
                id: 1,
                slug: 'find-maximum-element',
                title: 'Find Maximum Element',
                description: `Write a function that finds the maximum element in an array.

**Example:**
\`\`\`
Input: [3, 5, 2, 8, 1]
Output: 8
\`\`\`

**Constraints:**
- 1 <= arr.length <= 1000
- -1000 <= arr[i] <= 1000`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                slug: 'two-sum-array',
                title: 'Two Sum',
                description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 3,
                slug: 'remove-duplicates',
                title: 'Remove Duplicates from Sorted Array',
                description: `Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Return k after placing the final result in the first k slots of nums.

**Example:**
\`\`\`
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
\`\`\`

**Constraints:**
- 1 <= nums.length <= 3 * 10^4
- -100 <= nums[i] <= 100
- nums is sorted in non-decreasing order.`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 4,
                slug: 'rotate-array',
                title: 'Rotate Array',
                description: `Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.

**Example:**
\`\`\`
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]
\`\`\`

**Constraints:**
- 1 <= nums.length <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- 0 <= k <= 10^5`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 5,
                slug: 'product-except-self',
                title: 'Product of Array Except Self',
                description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operator.

**Example:**
\`\`\`
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
\`\`\`

**Constraints:**
- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
- The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            },
            // String Problems
            {
                id: 6,
                slug: 'reverse-string',
                title: 'Reverse String',
                description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

**Example:**
\`\`\`
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
\`\`\`

**Constraints:**
- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 7,
                slug: 'valid-palindrome',
                title: 'Valid Palindrome',
                description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

**Example:**
\`\`\`
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
\`\`\`

**Constraints:**
- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters.`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 8,
                slug: 'longest-common-prefix',
                title: 'Longest Common Prefix',
                description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

**Example:**
\`\`\`
Input: strs = ["flower","flow","flight"]
Output: "fl"
\`\`\`

**Constraints:**
- 1 <= strs.length <= 200
- 0 <= strs[i].length <= 200
- strs[i] consists of only lowercase English letters.`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 9,
                slug: 'group-anagrams',
                title: 'Group Anagrams',
                description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

**Example:**
\`\`\`
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\`

**Constraints:**
- 1 <= strs.length <= 10^4
- 0 <= strs[i].length <= 100
- strs[i] consists of lowercase English letters only.`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 10,
                slug: 'longest-substring-without-repeating',
                title: 'Longest Substring Without Repeating Characters',
                description: `Given a string s, find the length of the longest substring without repeating characters.

**Example:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

**Constraints:**
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Math Problems
            {
                id: 11,
                slug: 'climbing-stairs',
                title: 'Climbing Stairs',
                description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example:**
\`\`\`
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
\`\`\`

**Constraints:**
- 1 <= n <= 45`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 12,
                slug: 'power-of-two',
                title: 'Power of Two',
                description: `Given an integer n, return true if it is a power of two. Otherwise, return false.

An integer n is a power of two, if there exists an integer x such that n == 2^x.

**Example:**
\`\`\`
Input: n = 1
Output: true
Explanation: 2^0 = 1
\`\`\`

**Constraints:**
- -2^31 <= n <= 2^31 - 1`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 13,
                slug: 'factorial-trailing-zeros',
                title: 'Factorial Trailing Zeroes',
                description: `Given an integer n, return the number of trailing zeroes in n!.

Note that n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1.

**Example:**
\`\`\`
Input: n = 3
Output: 0
Explanation: 3! = 6, no trailing zero.
\`\`\`

**Constraints:**
- 0 <= n <= 10^4`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 14,
                slug: 'happy-number',
                title: 'Happy Number',
                description: `Write an algorithm to determine if a number n is happy.

A happy number is a number defined by the following process:

Starting with any positive integer, replace the number by the sum of the squares of its digits.
Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
Those numbers for which this process ends in 1 are happy.

**Example:**
\`\`\`
Input: n = 19
Output: true
Explanation:
1^2 + 9^2 = 82
8^2 + 2^2 = 68
6^2 + 8^2 = 100
1^2 + 0^2 + 0^2 = 1
\`\`\`

**Constraints:**
- 1 <= n <= 2^31 - 1`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 15,
                slug: 'sqrt',
                title: 'Sqrt(x)',
                description: `Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.

You must not use any built-in exponent function or operator.

**Example:**
\`\`\`
Input: x = 4
Output: 2
Explanation: The square root of 4 is 2.
\`\`\`

**Constraints:**
- 0 <= x <= 2^31 - 1`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Sorting Problems
            {
                id: 16,
                slug: 'merge-sorted-arrays',
                title: 'Merge Sorted Array',
                description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums2 into nums1 as one sorted array.

**Example:**
\`\`\`
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
\`\`\`

**Constraints:**
- nums1.length == m + n
- nums2.length == n
- 0 <= m, n <= 200
- 1 <= m + n <= 200
- -10^9 <= nums1[i], nums2[j] <= 10^9`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 17,
                slug: 'first-bad-version',
                title: 'First Bad Version',
                description: `You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad.

You are given an API bool isBadVersion(version) which returns whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

**Example:**
\`\`\`
Input: n = 5, bad = 4
Output: 4
Explanation:
call isBadVersion(3) -> false
call isBadVersion(5) -> true
call isBadVersion(4) -> true
Then 4 is the first bad version.
\`\`\`

**Constraints:**
- 1 <= bad <= n <= 2^31 - 1`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 18,
                slug: 'search-insert-position',
                title: 'Search Insert Position',
                description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.

**Example:**
\`\`\`
Input: nums = [1,3,5,6], target = 5
Output: 2
\`\`\`

**Constraints:**
- 1 <= nums.length <= 10^4
- -10^4 <= nums[i] <= 10^4
- nums contains distinct values sorted in ascending order.
- -10^4 <= target <= 10^4`,
                difficulty: 'easy',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 19,
                slug: 'find-peak-element',
                title: 'Find Peak Element',
                description: `A peak element is an element that is strictly greater than its neighbors.

Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.

You may imagine that nums[-1] = nums[n] = -∞.

**Example:**
\`\`\`
Input: nums = [1,2,3,1]
Output: 2
Explanation: 3 is a peak element and your function should return the index number 2.
\`\`\`

**Constraints:**
- 1 <= nums.length <= 1000
- -2^31 <= nums[i] <= 2^31 - 1
- For all valid i, nums[i] != nums[i + 1]`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 20,
                slug: 'kth-largest-element',
                title: 'Kth Largest Element in an Array',
                description: `Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in sorted order, not the kth distinct element.

**Example:**
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\`

**Constraints:**
- 1 <= k <= nums.length <= 10^4
- -10^4 <= nums[i] <= 10^4`,
                difficulty: 'medium',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 5. Create Problem-Category relationships
        const problemCategories = [];
        for (let i = 1; i <= 20; i++) {
            problemCategories.push({
                problem_id: i,
                category_id: 1,
                created_at: new Date(),
                updated_at: new Date()
            });
        }
        await queryInterface.bulkInsert('problem_categories', problemCategories);

        // 6. Create Problem-Tag relationships
        const problemTags = [
            // Array problems
            { problem_id: 1, tag_id: 1, created_at: new Date(), updated_at: new Date() },
            { problem_id: 2, tag_id: 1, created_at: new Date(), updated_at: new Date() },
            { problem_id: 3, tag_id: 1, created_at: new Date(), updated_at: new Date() },
            { problem_id: 4, tag_id: 1, created_at: new Date(), updated_at: new Date() },
            { problem_id: 5, tag_id: 1, created_at: new Date(), updated_at: new Date() },
            // String problems
            { problem_id: 6, tag_id: 2, created_at: new Date(), updated_at: new Date() },
            { problem_id: 7, tag_id: 2, created_at: new Date(), updated_at: new Date() },
            { problem_id: 8, tag_id: 2, created_at: new Date(), updated_at: new Date() },
            { problem_id: 9, tag_id: 2, created_at: new Date(), updated_at: new Date() },
            { problem_id: 10, tag_id: 2, created_at: new Date(), updated_at: new Date() },
            // Math problems
            { problem_id: 11, tag_id: 3, created_at: new Date(), updated_at: new Date() },
            { problem_id: 12, tag_id: 3, created_at: new Date(), updated_at: new Date() },
            { problem_id: 13, tag_id: 3, created_at: new Date(), updated_at: new Date() },
            { problem_id: 14, tag_id: 3, created_at: new Date(), updated_at: new Date() },
            { problem_id: 15, tag_id: 3, created_at: new Date(), updated_at: new Date() },
            // Sorting problems
            { problem_id: 16, tag_id: 4, created_at: new Date(), updated_at: new Date() },
            { problem_id: 17, tag_id: 4, created_at: new Date(), updated_at: new Date() },
            { problem_id: 18, tag_id: 4, created_at: new Date(), updated_at: new Date() },
            { problem_id: 19, tag_id: 4, created_at: new Date(), updated_at: new Date() },
            { problem_id: 20, tag_id: 4, created_at: new Date(), updated_at: new Date() }
        ];
        await queryInterface.bulkInsert('problem_tags', problemTags);

        console.log('✅ JavaScript problems seeded successfully!');
    },

    async down(queryInterface, Sequelize) {
        // Remove in reverse order to avoid foreign key constraint errors
        await queryInterface.bulkDelete('problem_tags', null, {});
        await queryInterface.bulkDelete('problem_categories', null, {});
        await queryInterface.bulkDelete('problems', null, {});
        await queryInterface.bulkDelete('tags', null, {});
        await queryInterface.bulkDelete('categories', null, {});
        await queryInterface.bulkDelete('languages', null, {});

        console.log('✅ JavaScript problems removed successfully!');
    }
};