'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Create Examples for problems
        await queryInterface.bulkInsert('examples', [
            // Find Maximum Element
            {
                id: 1,
                problem_id: 1,
                input: '[3, 5, 2, 8, 1]',
                output: '8',
                explanation: 'The maximum element in the array is 8.',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                problem_id: 1,
                input: '[1, 1, 1, 1]',
                output: '1',
                explanation: 'All elements are the same, so the maximum is 1.',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Two Sum
            {
                id: 3,
                problem_id: 2,
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 4,
                problem_id: 2,
                input: 'nums = [3,2,4], target = 6',
                output: '[1,2]',
                explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Remove Duplicates
            {
                id: 5,
                problem_id: 3,
                input: '[1,1,2]',
                output: '2, nums = [1,2,_]',
                explanation: 'Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Rotate Array
            {
                id: 6,
                problem_id: 4,
                input: 'nums = [1,2,3,4,5,6,7], k = 3',
                output: '[5,6,7,1,2,3,4]',
                explanation: 'rotate 1 steps to the right: [7,1,2,3,4,5,6], rotate 2 steps to the right: [6,7,1,2,3,4,5], rotate 3 steps to the right: [5,6,7,1,2,3,4]',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Reverse String
            {
                id: 7,
                problem_id: 6,
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]',
                explanation: 'The string "hello" reversed is "olleh".',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Valid Palindrome
            {
                id: 8,
                problem_id: 7,
                input: 's = "A man, a plan, a canal: Panama"',
                output: 'true',
                explanation: '"amanaplanacanalpanama" is a palindrome.',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Climbing Stairs
            {
                id: 9,
                problem_id: 11,
                input: 'n = 2',
                output: '2',
                explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Merge Sorted Array
            {
                id: 10,
                problem_id: 16,
                input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
                output: '[1,2,2,3,5,6]',
                explanation: 'The arrays we are merging are [1,2,3] and [2,5,6].',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 2. Create Test Cases for ALL problems
        await queryInterface.bulkInsert('test_cases', [
            // Problem 1: Find Maximum Element
            {
                id: 1,
                problem_id: 1,
                input: 'findMax([3, 5, 2, 8, 1])',
                expected_output: '8',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                problem_id: 1,
                input: 'findMax([1, 1, 1, 1])',
                expected_output: '1',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 3,
                problem_id: 1,
                input: 'findMax([-5, -2, -8, -1])',
                expected_output: '-1',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 2: Two Sum
            {
                id: 4,
                problem_id: 2,
                input: 'twoSum([2,7,11,15], 9)',
                expected_output: '[0,1]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 5,
                problem_id: 2,
                input: 'twoSum([3,2,4], 6)',
                expected_output: '[1,2]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 6,
                problem_id: 2,
                input: 'twoSum([3,3], 6)',
                expected_output: '[0,1]',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 3: Remove Duplicates
            {
                id: 7,
                problem_id: 3,
                input: 'removeDuplicates([1,1,2])',
                expected_output: '2',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 8,
                problem_id: 3,
                input: 'removeDuplicates([0,0,1,1,1,2,2,3,3,4])',
                expected_output: '5',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 9,
                problem_id: 3,
                input: 'removeDuplicates([1,2,3,4,5])',
                expected_output: '5',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 4: Rotate Array
            {
                id: 10,
                problem_id: 4,
                input: 'rotate([1,2,3,4,5,6,7], 3)',
                expected_output: '[5,6,7,1,2,3,4]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 11,
                problem_id: 4,
                input: 'rotate([-1,-100,3,99], 2)',
                expected_output: '[3,99,-1,-100]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 12,
                problem_id: 4,
                input: 'rotate([1,2], 3)',
                expected_output: '[2,1]',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 5: Product of Array Except Self
            {
                id: 13,
                problem_id: 5,
                input: 'productExceptSelf([1,2,3,4])',
                expected_output: '[24,12,8,6]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 14,
                problem_id: 5,
                input: 'productExceptSelf([-1,1,0,-3,3])',
                expected_output: '[0,0,9,0,0]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 15,
                problem_id: 5,
                input: 'productExceptSelf([2,3,4,5])',
                expected_output: '[60,40,30,24]',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 6: Reverse String
            {
                id: 16,
                problem_id: 6,
                input: 'reverseString(["h","e","l","l","o"])',
                expected_output: '["o","l","l","e","h"]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 17,
                problem_id: 6,
                input: 'reverseString(["H","a","n","n","a","h"])',
                expected_output: '["h","a","n","n","a","H"]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 18,
                problem_id: 6,
                input: 'reverseString(["a"])',
                expected_output: '["a"]',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 7: Valid Palindrome
            {
                id: 19,
                problem_id: 7,
                input: 'isPalindrome("A man, a plan, a canal: Panama")',
                expected_output: 'true',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 20,
                problem_id: 7,
                input: 'isPalindrome("race a car")',
                expected_output: 'false',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 21,
                problem_id: 7,
                input: 'isPalindrome(" ")',
                expected_output: 'true',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 8: Longest Common Prefix
            {
                id: 22,
                problem_id: 8,
                input: 'longestCommonPrefix(["flower","flow","flight"])',
                expected_output: '"fl"',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 23,
                problem_id: 8,
                input: 'longestCommonPrefix(["dog","racecar","car"])',
                expected_output: '""',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 24,
                problem_id: 8,
                input: 'longestCommonPrefix(["a"])',
                expected_output: '"a"',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 9: Group Anagrams
            {
                id: 25,
                problem_id: 9,
                input: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"])',
                expected_output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 26,
                problem_id: 9,
                input: 'groupAnagrams([""])',
                expected_output: '[[""]]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 27,
                problem_id: 9,
                input: 'groupAnagrams(["a"])',
                expected_output: '[["a"]]',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 10: Longest Substring Without Repeating Characters
            {
                id: 28,
                problem_id: 10,
                input: 'lengthOfLongestSubstring("abcabcbb")',
                expected_output: '3',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 29,
                problem_id: 10,
                input: 'lengthOfLongestSubstring("bbbbb")',
                expected_output: '1',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 30,
                problem_id: 10,
                input: 'lengthOfLongestSubstring("pwwkew")',
                expected_output: '3',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 11: Climbing Stairs
            {
                id: 31,
                problem_id: 11,
                input: 'climbStairs(2)',
                expected_output: '2',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 32,
                problem_id: 11,
                input: 'climbStairs(3)',
                expected_output: '3',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 33,
                problem_id: 11,
                input: 'climbStairs(1)',
                expected_output: '1',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 12: Power of Two
            {
                id: 34,
                problem_id: 12,
                input: 'isPowerOfTwo(1)',
                expected_output: 'true',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 35,
                problem_id: 12,
                input: 'isPowerOfTwo(16)',
                expected_output: 'true',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 36,
                problem_id: 12,
                input: 'isPowerOfTwo(3)',
                expected_output: 'false',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 13: Factorial Trailing Zeroes
            {
                id: 37,
                problem_id: 13,
                input: 'trailingZeroes(3)',
                expected_output: '0',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 38,
                problem_id: 13,
                input: 'trailingZeroes(5)',
                expected_output: '1',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 39,
                problem_id: 13,
                input: 'trailingZeroes(0)',
                expected_output: '0',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 14: Happy Number
            {
                id: 40,
                problem_id: 14,
                input: 'isHappy(19)',
                expected_output: 'true',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 41,
                problem_id: 14,
                input: 'isHappy(2)',
                expected_output: 'false',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 42,
                problem_id: 14,
                input: 'isHappy(1)',
                expected_output: 'true',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 15: Sqrt(x)
            {
                id: 43,
                problem_id: 15,
                input: 'mySqrt(4)',
                expected_output: '2',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 44,
                problem_id: 15,
                input: 'mySqrt(8)',
                expected_output: '2',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 45,
                problem_id: 15,
                input: 'mySqrt(0)',
                expected_output: '0',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 16: Merge Sorted Array
            {
                id: 46,
                problem_id: 16,
                input: 'merge([1,2,3,0,0,0], 3, [2,5,6], 3)',
                expected_output: '[1,2,2,3,5,6]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 47,
                problem_id: 16,
                input: 'merge([1], 1, [], 0)',
                expected_output: '[1]',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 48,
                problem_id: 16,
                input: 'merge([0], 0, [1], 1)',
                expected_output: '[1]',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 17: First Bad Version
            {
                id: 49,
                problem_id: 17,
                input: 'firstBadVersion(5)',
                expected_output: '4',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 50,
                problem_id: 17,
                input: 'firstBadVersion(1)',
                expected_output: '1',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 51,
                problem_id: 17,
                input: 'firstBadVersion(3)',
                expected_output: '2',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 18: Search Insert Position
            {
                id: 52,
                problem_id: 18,
                input: 'searchInsert([1,3,5,6], 5)',
                expected_output: '2',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 53,
                problem_id: 18,
                input: 'searchInsert([1,3,5,6], 2)',
                expected_output: '1',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 54,
                problem_id: 18,
                input: 'searchInsert([1,3,5,6], 7)',
                expected_output: '4',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 19: Find Peak Element
            {
                id: 55,
                problem_id: 19,
                input: 'findPeakElement([1,2,3,1])',
                expected_output: '2',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 56,
                problem_id: 19,
                input: 'findPeakElement([1,2,1,3,5,6,4])',
                expected_output: '5',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 57,
                problem_id: 19,
                input: 'findPeakElement([1])',
                expected_output: '0',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 20: Kth Largest Element in an Array
            {
                id: 58,
                problem_id: 20,
                input: 'findKthLargest([3,2,1,5,6,4], 2)',
                expected_output: '5',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 59,
                problem_id: 20,
                input: 'findKthLargest([3,2,3,1,2,4,5,5,6], 4)',
                expected_output: '4',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 60,
                problem_id: 20,
                input: 'findKthLargest([1], 1)',
                expected_output: '1',
                is_public: false,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 3. Create Problem Hints (simplified for all problems)
        await queryInterface.bulkInsert('problem_hints', [
            // Problem 1: Find Maximum Element
            {
                id: 1,
                problem_id: 1,
                hint_order: 1,
                title: 'Iterate through the array',
                content: 'Start with the first element as the maximum, then compare with each subsequent element.',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                problem_id: 1,
                hint_order: 2,
                title: 'Update maximum when needed',
                content: 'If you find an element greater than the current maximum, update the maximum.',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 2: Two Sum
            {
                id: 3,
                problem_id: 2,
                hint_order: 1,
                title: 'Brute Force Approach',
                content: 'Use two nested loops to check every pair of numbers.',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 4,
                problem_id: 2,
                hint_order: 2,
                title: 'Hash Map Solution',
                content: 'Use a Map to store numbers and their indices for O(n) time complexity.',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 8: Longest Common Prefix
            {
                id: 5,
                problem_id: 8,
                hint_order: 1,
                title: 'Compare character by character',
                content: 'Start with the first string as the prefix, then compare with each subsequent string.',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 6,
                problem_id: 8,
                hint_order: 2,
                title: 'Shorten prefix when needed',
                content: 'If a character doesn\'t match, shorten the prefix to the matching part.',
                is_public: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 4. Create Problem Starters (simplified for all problems)
        await queryInterface.bulkInsert('problem_starters', [
            // Problem 1: Find Maximum Element
            {
                id: 1,
                problem_id: 1,
                language_id: 1,
                starter_code: `/**
 * @param {number[]} arr
 * @return {number}
 */
function findMax(arr) {
    // Your code here
    
}`,
                version: 'node18',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 2: Two Sum
            {
                id: 2,
                problem_id: 2,
                language_id: 1,
                starter_code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
    
}`,
                version: 'node18',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 8: Longest Common Prefix
            {
                id: 3,
                problem_id: 8,
                language_id: 1,
                starter_code: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs) {
    // Your code here
    
}`,
                version: 'node18',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // 5. Create Problem Solutions (simplified for key problems)
        await queryInterface.bulkInsert('problem_solutions', [
            // Problem 1: Find Maximum Element
            {
                id: 1,
                problem_id: 1,
                language_id: 1,
                solution_code: `/**
 * @param {number[]} arr
 * @return {number}
 */
function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}`,
                explanation: 'This solution iterates through the array once, keeping track of the maximum element found so far.',
                time_complexity: 'O(n)',
                space_complexity: 'O(1)',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 2: Two Sum
            {
                id: 2,
                problem_id: 2,
                language_id: 1,
                solution_code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
                explanation: 'This solution uses a hash map to store numbers and their indices. For each element, we calculate the complement (target - current number) and check if it exists in the map.',
                time_complexity: 'O(n)',
                space_complexity: 'O(n)',
                created_at: new Date(),
                updated_at: new Date()
            },
            // Problem 8: Longest Common Prefix
            {
                id: 3,
                problem_id: 8,
                language_id: 1,
                solution_code: `/**
 * @param {string[]} strs
 * @return {string}
 */
function longestCommonPrefix(strs) {
    if (strs.length === 0) return "";
    
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }
    return prefix;
}`,
                explanation: 'This solution starts with the first string as the prefix, then compares it with each subsequent string, shortening the prefix when characters don\'t match.',
                time_complexity: 'O(S) where S is the sum of all characters',
                space_complexity: 'O(1)',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        console.log('✅ JavaScript problem details seeded successfully!');
    },

    async down(queryInterface, Sequelize) {
        // Remove in reverse order to avoid foreign key constraint errors
        await queryInterface.bulkDelete('problem_solutions', null, {});
        await queryInterface.bulkDelete('problem_starters', null, {});
        await queryInterface.bulkDelete('problem_hints', null, {});
        await queryInterface.bulkDelete('test_cases', null, {});
        await queryInterface.bulkDelete('examples', null, {});

        console.log('✅ JavaScript problem details removed successfully!');
    }
};