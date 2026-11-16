# AlgoLearn — Java DSA Learning Hub

A React + Tailwind CSS redesign of the original Java DSA Guide for Beginners.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## What's included

- React component-based application powered by Vite.
- Tailwind CSS utility styling with responsive layouts and dark mode.
- Searchable curriculum sidebar, topic progress tracking, previous/next lesson navigation, and local progress persistence.
- Five learning areas: Data Structures, Java Collections Framework, Algorithms, and Advanced Systems (plus the curriculum overview/navigation).
- 34 topics retained from the supplied guide, including Stack, Queue, Java Collections, linear search, binary search, Bubble Sort, Insertion Sort, Selection Sort, and 10 integrated systems.
- Expanded theory and learning notes: mental models, internal representation, trade-offs, Big-O context, vocabulary, and common mistakes for every lesson. Several core topics also include topic-specific theory cards.
- Complete Java examples with imports, classes, main methods, sample console output, and beginner-friendly walkthroughs for core structures and algorithms.
- An interactive ArrayList Product Inventory simulator with Product ID, Product Name, Category, Brand, and Description fields. It supports add, update, search, delete, display, reset, and suggested next actions.
- Before/after snapshots and step-by-step explanations showing ArrayList indexing and how deletion shifts later elements left.
- Existing step-by-step trackers, quizzes, practice challenges, and multi-collection simulators for advanced system examples.
- Multi-collection simulators for the advanced system examples.

## Project structure

```text
src/
  App.jsx                 Main React UI and learning components
  index.css               Tailwind directives and theme styles
  main.jsx                React entry point
  data/
    legacy-data.js        Original topic, quiz, and system data adapted for React
index.html
vite.config.js
tailwind.config.js
postcss.config.js
package.json
```

## Updated learning experience

The ArrayList visual tracker now uses a product inventory scenario rather than price/quantity fields. The real-world example tab includes a complete `Main.java` program for the inventory scenario, plus full runnable examples for Stack, Queue, LinkedList, Set/Map variants, PriorityQueue, Deque, Iterator, Linear Search, Binary Search, Bubble Sort, Insertion Sort, and Selection Sort.

## Notes

The original tutorial text, Java snippets, quizzes, and interactive algorithm step data were retained as the content foundation. New explanations and interface elements are additional learning material. Complexity figures are educational guidance; exact performance depends on implementation and input characteristics.


## Newly added sorting lessons

- **Insertion Sort:** complete Java program, stable-sort explanation, sorted-prefix/key/shift concepts, best O(n), average and worst O(n²), O(1) extra space, interactive trace, quiz, and practice task.
- **Selection Sort:** complete Java program, minimum-index scan and swap explanation, O(n²) best/average/worst time, O(1) extra space, interactive trace, quiz, and practice task.
- Both visual trackers accept comma-separated numeric input and show comparisons, shifts or minimum selection, swaps, sorted positions, and the resulting array.
