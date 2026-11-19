import React, { useEffect, useMemo, useRef, useState } from 'react';
import './data/legacy-data.js';
import { BookOpen, BrainCircuit, Check, ChevronDown, ChevronRight, CircleHelp, Code2, Command, Compass, GraduationCap, Layers3, Lightbulb, ListChecks, Menu, Moon, Play, Search, Sparkles, Sun, Trophy, X, RotateCcw, ArrowLeft, ArrowRight, Terminal, Clock3, Target, PanelLeftClose, Pause, SkipBack, SkipForward } from 'lucide-react';

const { topics: TOPICS = {}, quizzes: QUIZZES = {} } = window.DSA_GUIDE || {};
const GROUP_ORDER = ['Getting Started', 'Data Structures', 'Java Collections', 'Algorithms', 'Advanced Systems'];
const GROUP_ICON = { 'Data Structures': Layers3, 'Java Collections': Code2, Algorithms: BrainCircuit, 'Advanced Systems': Command };
const extras = {
  stack: { theory: 'A stack is an abstract data type (ADT) whose access rule is LIFO: the newest item is the first one removed. The structure exposes the top rather than arbitrary positions.', model: 'Imagine a stack of cafeteria trays. You place a tray on top and take the top tray first; reaching into the middle would violate the rule.', representation: 'A stack can be implemented with an array or a linked structure. Java’s ArrayDeque is usually a good general-purpose Stack replacement.', tradeoff: 'Push and pop are typically O(1). The restriction makes undo history and nested-expression processing straightforward.', pitfalls: ['Calling pop() on an empty stack can throw NoSuchElementException.', 'peek() reads the top; it does not remove it.', 'A stack is not the same as a queue: their removal order is opposite.'], terms: [['LIFO','Last In, First Out'],['Top','The only end where insertion/removal happens'],['Underflow','Trying to remove from an empty stack']] },
  queue: { theory: 'A queue is an abstract data type that follows FIFO (First In, First Out). Enqueue adds at the rear; dequeue removes from the front.', model: 'Think of a checkout line: a customer who joins first is normally served first.', representation: 'A circular array or linked nodes can implement a queue. Java Queue is an interface; LinkedList and ArrayDeque are common implementations.', tradeoff: 'Offer and poll are generally O(1) with a suitable implementation. FIFO is fair for arrival-ordered work, but it cannot prioritize urgent jobs.', pitfalls: ['poll() returns null on an empty queue; remove() throws an exception.', 'peek() inspects the front without removing it.', 'Do not confuse FIFO queues with PriorityQueue ordering.'], terms: [['FIFO','First In, First Out'],['Front','Next item to be removed'],['Rear','Where new items join']] },
  arraylist: { theory: 'ArrayList is a resizable-array implementation of List. Elements occupy indexed positions, and the list grows its backing array when capacity is exhausted.', model: 'Picture numbered lockers in a row: locker 0, locker 1, locker 2, and so on.', representation: 'A backing array stores references contiguously. When full, Java allocates a larger array and copies references.', tradeoff: 'get(index) is O(1). Appending is amortized O(1), while inserting/removing near the beginning or middle is O(n) because elements shift.', pitfalls: ['Indexes begin at zero.', 'Capacity and size are different: capacity is storage room; size is the number of elements.', 'Removing by index differs from removing by object when using overloaded methods.'], terms: [['Index','Zero-based position'],['Capacity','Length of the internal backing array'],['Amortized','Average cost across a sequence of operations']] },
  linkedlist: { theory: 'A linked list stores values in nodes connected by references. A doubly linked list keeps both next and previous links.', model: 'Imagine train cars coupled together. Each car knows its neighbor, but you must travel along the train to reach a distant car.', representation: 'Java LinkedList is doubly linked and implements both List and Deque.', tradeoff: 'Adding/removing at either end is O(1). Accessing an arbitrary index is O(n), and each node requires extra reference memory.', pitfalls: ['LinkedList.get(i) is not constant time.', 'A node is not an array slot; traversal follows links.', 'Choose it because of operation patterns, not because the name sounds faster.'], terms: [['Node','A value plus one or more links'],['Head','First node'],['Tail','Last node']] },
  hashset: { theory: 'A Set models membership without duplicates. HashSet uses hashing to distribute elements into buckets and relies on equals() and hashCode() to identify duplicates.', model: 'Think of a guest list: checking whether a person is already registered matters more than their position in the list.', representation: 'A hash table uses an element’s hash code to find a bucket, then equality checks distinguish colliding values.', tradeoff: 'add, remove, and contains are O(1) on average, but can degrade with poor hashing or heavy collisions. Iteration order is not guaranteed.', pitfalls: ['Do not depend on HashSet iteration order.', 'Objects used as set elements should implement equals() and hashCode() consistently.', 'Adding an equal element does not create a second copy.'], terms: [['Hash code','Integer used to help locate a bucket'],['Collision','Different values mapped to the same bucket'],['Uniqueness','A set stores at most one equal element']] },
  hashmap: { theory: 'Map associates keys with values. HashMap uses hashing for average constant-time lookup, insertion, and removal; each key maps to at most one value.', model: 'A dictionary maps a word (key) to its definition (value). You search by the key, not by a numeric position.', representation: 'HashMap computes a hash from the key, locates a bucket, and uses equals() to identify the matching key.', tradeoff: 'get and put are O(1) on average. HashMap does not promise iteration order and allows one null key and null values.', pitfalls: ['Putting an existing key replaces its old value.', 'A missing key returns null unless you use getOrDefault().', 'Mutable keys are dangerous if fields used by equals/hashCode change after insertion.'], terms: [['Key','Unique lookup identifier'],['Value','Data associated with a key'],['Entry','A key-value pair']] },
  linear: { theory: 'Linear search is a sequential search algorithm. It examines elements in order and stops when the target is found or the sequence ends.', model: 'Searching an unsorted attendance sheet means reading names one at a time until a match appears.', representation: 'A loop maintains the current index i. Each iteration performs one comparison and advances i.', tradeoff: 'Best case O(1), worst case O(n), and O(1) extra space. It works even when data is unsorted.', pitfalls: ['The last valid array index is length - 1.', 'Return -1 only when no match exists.', 'If duplicates exist, this version returns the first match.'], terms: [['Target','Value being searched for'],['Index','Position of the current element'],['Worst case','The maximum work for an input of size n']] },
  binary: { theory: 'Binary search is a divide-and-conquer search algorithm. It repeatedly halves a sorted search interval, discarding the half that cannot contain the target.', model: 'A dictionary is alphabetized. Open near the middle, compare, and eliminate half the remaining pages.', representation: 'The low and high indexes describe a closed interval. mid selects its midpoint; one boundary moves after each comparison.', tradeoff: 'Worst-case time is O(log n), with O(1) extra space for the iterative version. The data must be sorted using the same ordering as the comparisons.', pitfalls: ['Binary search requires sorted data.', 'Use low <= high for a closed interval.', 'For very large indexes, low + (high - low) / 2 avoids integer overflow.'], terms: [['Divide and conquer','Solve a problem by repeatedly reducing its size'],['Invariant','A condition that remains true each iteration'],['Logarithmic','Input doubling adds roughly one more step']] },
  bubble: { theory: 'Bubble sort is a comparison-based, in-place sorting algorithm. It repeatedly compares adjacent values and swaps out-of-order pairs.', model: 'During a left-to-right pass, a large value moves toward the end through adjacent swaps.', representation: 'The outer loop counts passes; the inner loop compares neighbors. After pass i, the final i positions are already sorted.', tradeoff: 'Worst/average time is O(n²), best case is O(n) with an early-exit optimization, and extra space is O(1). It is useful for learning, not large datasets.', pitfalls: ['Compare a[j] with a[j + 1], not with itself.', 'The inner loop shrinks because the tail is already sorted.', 'A swap needs a temporary variable so one value is not overwritten.'], terms: [['Stable sort','Equal elements keep their original relative order'],['In-place','Uses constant extra storage'],['Pass','One complete sweep through the unsorted portion']] }
};

Object.assign(extras, {
  insertion:{theory:"Insertion Sort is a stable, in-place comparison sort. It maintains an already-sorted prefix and inserts each next key into the correct position by shifting larger values to the right. Its work depends strongly on how close the input already is to sorted order.",model:"Imagine holding playing cards. Your left hand is the sorted cards. Pick up the next card from the table, move larger cards to the right, and slide the new card into the gap.",representation:"The outer loop chooses the next key at index i. The variable j walks backward through the sorted prefix. While a[j] is greater than key, copy a[j] to a[j + 1]. Finally assign key to a[j + 1].",tradeoff:"Best case is O(n) when the array is already sorted because the while loop quickly stops. Average and worst cases are O(n²), with O(1) auxiliary space. It is stable when the comparison uses > rather than >=, because equal values are not moved past one another.",pitfalls:["Do not forget to save a[i] in key before shifting; otherwise the original value can be overwritten.","The condition j >= 0 must be checked before reading a[j].","After shifting, key belongs at a[j + 1], not a[j].","Insertion Sort is efficient for small or nearly sorted inputs, but not ideal for large random arrays."],terms:[["Key","The value currently being inserted into the sorted prefix"],["Sorted prefix","The portion at the beginning that is already in ascending order"],["Shift","Copying a value one position right to create an insertion gap"],["Stable sort","Equal values retain their original relative order"]]},
  selection:{theory:"Selection Sort is an in-place comparison sort. On each pass it scans the unsorted suffix, remembers the index of the smallest value, and swaps that value into the first unsorted position. The sorted prefix grows by one element per pass.",model:"Imagine choosing the shortest student from a line and placing that student into the first position. Then repeat with the remaining students, ignoring the positions already filled.",representation:"The outer loop selects the next destination index i. minIndex remembers the smallest value found so far. The inner loop scans j from i + 1 to the end. After the scan, one swap places the minimum at index i.",tradeoff:"Best, average, and worst-case time are all O(n²), because every pass scans the remaining unsorted section even if the data is already sorted. It uses O(1) extra space and performs at most n - 1 swaps. Standard swap-based Selection Sort is generally not stable.",pitfalls:["Update minIndex when a smaller value is found; do not swap immediately on every comparison.","The inner loop begins at i + 1 because a[i] is the current minimum candidate.","Perform the swap after the full scan, not before it.","Selection Sort still performs quadratic comparisons on an already sorted array."],terms:[["minIndex","The index of the smallest value found in the current scan"],["Unsorted suffix","The part of the array that has not yet been placed in final position"],["Pass","One full scan of the remaining unsorted section"],["In-place","Uses a constant amount of extra storage"]]}
});

const generalTheory = (t, key) => ({ theory: `${t.name} is part of the Java Collections and data-structure toolbox. The key design question is which operations your program performs most often: lookup, insertion, deletion, ordering, or traversal.`, model: t.simple, representation: `Java exposes this concept through interfaces and concrete classes. Program to the most suitable interface where possible, then select an implementation based on its performance and ordering guarantees.`, tradeoff: `Use the complexity notes as typical guidance, not an unconditional guarantee. Actual performance depends on data size, implementation details, hashing/comparison costs, and memory behavior.`, pitfalls: ['Choose a structure based on required behavior, not only on a single Big-O number.', 'Check whether order and duplicates are guaranteed by the chosen implementation.', 'Read the method contract for empty structures and missing keys.'], terms: [['Interface','A contract describing available operations'],['Implementation','A concrete class that provides the behavior'],['Complexity','How resource use grows as input size grows']] });
const theoryFor = (t, key) => extras[key] || generalTheory(t,key);
const prettyGroup = g => g === 'Java Collections' ? 'Java Collections Framework' : g;


const INVENTORY_JAVA_CODE = `import java.util.ArrayList;

class Product {
    private String id;
    private String name;
    private String category;
    private String brand;
    private String description;

    public Product(String id, String name, String category,
                   String brand, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.description = description;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getBrand() { return brand; }
    public String getDescription() { return description; }

    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return id + " | " + name + " | " + category + " | " + brand
                + " | " + description;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Product> products = new ArrayList<>();

        // 1. ADD: create products and store them in the ArrayList.
        products.add(new Product("P001", "Keyboard", "Electronics",
                "Logitech", "Wireless keyboard"));
        products.add(new Product("P002", "Notebook", "School Supplies",
                "PaperMate", "A5 ruled notebook"));
        products.add(new Product("P003", "Water Bottle", "Accessories",
                "Hydro", "Reusable 750ml bottle"));

        // 2. DISPLAY: enhanced for-loop visits each Product.
        System.out.println("=== ALL PRODUCTS ===");
        for (Product product : products) {
            System.out.println(product);
        }

        // 3. SEARCH: scan the list until the product ID matches.
        String searchId = "P002";
        Product found = null;
        for (Product product : products) {
            if (product.getId().equalsIgnoreCase(searchId)) {
                found = product;
                break;
            }
        }
        System.out.println("\\n=== SEARCH RESULT ===");
        System.out.println(found != null ? found : "Product not found");

        // 4. UPDATE: change the matching product's details.
        if (found != null) {
            found.setName("Hardcover Notebook");
            found.setDescription("A5 hardcover ruled notebook");
        }

        // 5. DELETE: remove the product with ID P001.
        String deleteId = "P001";
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getId().equalsIgnoreCase(deleteId)) {
                products.remove(i);
                break;
            }
        }

        // 6. DISPLAY the final ArrayList after update and deletion.
        System.out.println("\\n=== FINAL INVENTORY ===");
        for (Product product : products) {
            System.out.println(product);
        }

        System.out.println("\\nTotal products: " + products.size());
    }
}`;

function completeJavaExample(topicKey, topic) {
  const examples = {
    stack: {
      title: 'Text editor undo history using a Stack',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> undoHistory = new ArrayDeque<>();

        // Each saved version represents a change in the editor.
        undoHistory.push("Hello");
        undoHistory.push("Hello World");
        undoHistory.push("Hello World!");

        System.out.println("Current version: " + undoHistory.peek());

        // Undo removes the most recent version (LIFO).
        String removedVersion = undoHistory.pop();
        System.out.println("Undo removed: " + removedVersion);
        System.out.println("Version after undo: " + undoHistory.peek());
    }
}`,
      output: `Current version: Hello World!\nUndo removed: Hello World!\nVersion after undo: Hello World`,
      notes: ['Create an empty Deque. ArrayDeque is a modern choice for stack behavior.', 'push() adds a version to the top.', 'peek() reads the latest version without removing it.', 'pop() removes the latest version. This is LIFO: Last In, First Out.']
    },
    queue: {
      title: 'Office printer jobs using a Queue',
      code: `import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> printerQueue = new ArrayDeque<>();

        printerQueue.offer("Anna-report.pdf");
        printerQueue.offer("Ben-photo.png");
        printerQueue.offer("Cara-receipt.pdf");

        System.out.println("Waiting jobs: " + printerQueue);

        // The first submitted job is printed first.
        String printedJob = printerQueue.poll();
        System.out.println("Now printing: " + printedJob);
        System.out.println("Next job: " + printerQueue.peek());
        System.out.println("Remaining jobs: " + printerQueue);
    }
}`,
      output: `Waiting jobs: [Anna-report.pdf, Ben-photo.png, Cara-receipt.pdf]\nNow printing: Anna-report.pdf\nNext job: Ben-photo.png\nRemaining jobs: [Ben-photo.png, Cara-receipt.pdf]`,
      notes: ['Queue represents a line of jobs.', 'offer() inserts at the rear of the queue.', 'poll() removes the front item.', 'Because this is FIFO, the first submitted job is served first.']
    },
    linkedlist: {
      title: 'Music playlist using a LinkedList',
      code: `import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        LinkedList<String> playlist = new LinkedList<>();

        playlist.add("Song B");
        playlist.add("Song C");
        playlist.addFirst("Song A");
        playlist.addLast("Song D");

        System.out.println("Playlist: " + playlist);

        playlist.removeFirst(); // remove the current first song
        playlist.removeLast();  // remove the current last song

        System.out.println("After removing both ends: " + playlist);
        System.out.println("Now playing: " + playlist.getFirst());
    }
}`,
      output: `Playlist: [Song A, Song B, Song C, Song D]\nAfter removing both ends: [Song B, Song C]\nNow playing: Song B`,
      notes: ['Each LinkedList element is stored in a node connected to neighboring nodes.', 'addFirst() and addLast() insert at either end.', 'removeFirst() and removeLast() remove from either end.', 'LinkedList avoids shifting all later elements when changing an end node.']
    },
    hashset: {
      title: 'Prevent duplicate event registrations using a HashSet',
      code: `import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> registeredEmails = new HashSet<>();

        registeredEmails.add("ana@example.com");
        registeredEmails.add("ben@example.com");
        boolean addedAgain = registeredEmails.add("ana@example.com");

        System.out.println("Was duplicate added? " + addedAgain);
        System.out.println("Unique registrations: " + registeredEmails.size());
        System.out.println("Is Ben registered? " + registeredEmails.contains("ben@example.com"));
    }
}`,
      output: `Was duplicate added? false\nUnique registrations: 2\nIs Ben registered? true`,
      notes: ['A Set stores unique values.', 'add() returns false when the value already exists.', 'HashSet does not promise a predictable iteration order.', 'contains() checks whether an email is already registered.']
    },
    hashmap: {
      title: 'Find a student by ID using a HashMap',
      code: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<Integer, String> students = new HashMap<>();

        students.put(101, "Ana");
        students.put(102, "Ben");
        students.put(103, "Cara");

        int searchedId = 102;
        String studentName = students.get(searchedId);

        if (studentName != null) {
            System.out.println("Student " + searchedId + ": " + studentName);
        } else {
            System.out.println("Student not found.");
        }

        // A key is unique: this replaces the value for key 102.
        students.put(102, "Benjamin");
        System.out.println("Updated record: " + students.get(102));
    }
}`,
      output: `Student 102: Ben\nUpdated record: Benjamin`,
      notes: ['A Map stores key-value pairs.', 'put(id, name) associates a student ID with a name.', 'get(id) retrieves the value using its key.', 'Putting the same key again replaces its previous value.']
    },
    treeset: {
      title: 'Maintain unique sorted scores using a TreeSet',
      code: `import java.util.TreeSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<Integer> scores = new TreeSet<>();

        scores.add(85);
        scores.add(70);
        scores.add(95);
        scores.add(85); // duplicate ignored

        System.out.println("Unique sorted scores: " + scores);
        System.out.println("Lowest score: " + ((TreeSet<Integer>) scores).first());
        System.out.println("Highest score: " + ((TreeSet<Integer>) scores).last());
    }
}`,
      output: `Unique sorted scores: [70, 85, 95]\nLowest score: 70\nHighest score: 95`,
      notes: ['TreeSet stores unique elements.', 'It sorts values automatically using their natural ordering.', 'The duplicate 85 is ignored.', 'first() and last() access the smallest and largest values.']
    },
    pqueue: {
      title: 'Hospital triage using a PriorityQueue',
      code: `import java.util.PriorityQueue;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        // Smaller number means more urgent in this simple example.
        Queue<Integer> emergencyRoom = new PriorityQueue<>();

        emergencyRoom.offer(3); // low urgency
        emergencyRoom.offer(1); // critical
        emergencyRoom.offer(2); // medium urgency

        System.out.println("Next priority: " + emergencyRoom.peek());

        while (!emergencyRoom.isEmpty()) {
            int urgency = emergencyRoom.poll();
            System.out.println("Treat patient with urgency level: " + urgency);
        }
    }
}`,
      output: `Next priority: 1\nTreat patient with urgency level: 1\nTreat patient with urgency level: 2\nTreat patient with urgency level: 3`,
      notes: ['PriorityQueue chooses an element according to priority, not arrival order.', 'The default ordering for numbers is smallest first.', 'peek() shows the next item without removing it.', 'poll() removes the current highest-priority item.']
    },
    deque: {
      title: 'Browser navigation history using a Deque',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> browserHistory = new ArrayDeque<>();

        browserHistory.addLast("home.example");
        browserHistory.addLast("news.example");
        browserHistory.addLast("docs.example");

        System.out.println("Current page: " + browserHistory.peekLast());

        // Simulate pressing Back.
        String current = browserHistory.removeLast();
        System.out.println("Back from: " + current);
        System.out.println("Previous page: " + browserHistory.peekLast());
    }
}`,
      output: `Current page: docs.example\nBack from: docs.example\nPrevious page: news.example`,
      notes: ['Deque means double-ended queue.', 'addLast() adds a visited page at the back.', 'removeLast() simulates moving backward from the newest page.', 'A Deque can also support stack and queue behavior.']
    },
    iterator: {
      title: 'Remove cancelled orders safely using an Iterator',
      code: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> orders = new ArrayList<>();
        orders.add("A100");
        orders.add("X200"); // X means cancelled
        orders.add("A300");
        orders.add("X400");

        Iterator<String> iterator = orders.iterator();
        while (iterator.hasNext()) {
            String orderId = iterator.next();
            if (orderId.startsWith("X")) {
                iterator.remove();
            }
        }

        System.out.println("Active orders: " + orders);
    }
}`,
      output: 'Active orders: [A100, A300]',
      notes: ['iterator() creates a cursor positioned before the first element.', 'hasNext() checks whether another element exists.', 'next() moves forward and returns the current element.', 'iterator.remove() safely removes the element most recently returned.']
    },
    linkedhashset: {
      title: 'Recently viewed products without duplicates',
      code: `import java.util.LinkedHashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> recentlyViewed = new LinkedHashSet<>();
        recentlyViewed.add("Shoes");
        recentlyViewed.add("Hat");
        recentlyViewed.add("Watch");
        recentlyViewed.add("Shoes"); // duplicate ignored

        System.out.println("Recently viewed, in visit order: " + recentlyViewed);
    }
}`,
      output: 'Recently viewed, in visit order: [Shoes, Hat, Watch]',
      notes: ['LinkedHashSet combines uniqueness with insertion-order iteration.', 'The second Shoes entry is ignored.', 'Unlike HashSet, the iteration order is predictable.']
    },
    linkedhashmap: {
      title: 'Display menu categories in a chosen order',
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, String> menu = new LinkedHashMap<>();
        menu.put("Starter", "Soup");
        menu.put("Main", "Pasta");
        menu.put("Dessert", "Cake");

        for (Map.Entry<String, String> entry : menu.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
      output: 'Starter: Soup\\nMain: Pasta\\nDessert: Cake',
      notes: ['LinkedHashMap stores key-value pairs.', 'It remembers insertion order.', 'entrySet() lets a loop read each key and its value.']
    },
    treemap: {
      title: 'Keep a word dictionary sorted by key',
      code: `import java.util.Map;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        Map<String, String> dictionary = new TreeMap<>();
        dictionary.put("pear", "a fruit");
        dictionary.put("apple", "a fruit");
        dictionary.put("mango", "a fruit");

        for (Map.Entry<String, String> entry : dictionary.entrySet()) {
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }
    }
}`,
      output: 'apple = a fruit\\nmango = a fruit\\npear = a fruit',
      notes: ['TreeMap sorts entries by key.', 'The order is alphabetical for String keys.', 'The loop displays entries in sorted-key order.']
    },
    linear: {
      title: 'Find a student ID using Linear Search',
      code: `public class Main {
    public static void main(String[] args) {
        int[] studentIds = {104, 108, 112, 116, 120};
        int target = 112;
        int foundIndex = -1;

        for (int i = 0; i < studentIds.length; i++) {
            System.out.println("Checking index " + i + ": " + studentIds[i]);
            if (studentIds[i] == target) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex >= 0) {
            System.out.println("Student ID found at index " + foundIndex);
        } else {
            System.out.println("Student ID not found");
        }
    }
}`,
      output: 'Checking index 0: 104\\nChecking index 1: 108\\nChecking index 2: 112\\nStudent ID found at index 2',
      notes: ['Start at index 0.', 'Compare the current value with the target.', 'If they match, store the index and stop.', 'If no value matches, the target is not in the array.']
    },
    binary: {
      title: 'Find a student ID using Binary Search',
      code: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] studentIds = {104, 108, 112, 116, 120, 124, 128};
        int target = 120;
        int low = 0;
        int high = studentIds.length - 1;
        int foundIndex = -1;

        while (low <= high) {
            int middle = low + (high - low) / 2;
            if (studentIds[middle] == target) {
                foundIndex = middle;
                break;
            } else if (studentIds[middle] < target) {
                low = middle + 1;
            } else {
                high = middle - 1;
            }
        }

        System.out.println("Sorted IDs: " + Arrays.toString(studentIds));
        System.out.println("Found at index: " + foundIndex);
    }
}`,
      output: 'Sorted IDs: [104, 108, 112, 116, 120, 124, 128]\\nFound at index: 4',
      notes: ['Binary Search requires sorted data.', 'low and high mark the remaining search range.', 'Check the middle element.', 'Discard the half that cannot contain the target.', 'Repeat until found or low becomes greater than high.']
    },
    bubble: {
      title: 'Sort exam scores using Bubble Sort',
      code: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = {72, 95, 68, 88, 80};

        for (int pass = 0; pass < scores.length - 1; pass++) {
            for (int i = 0; i < scores.length - 1 - pass; i++) {
                if (scores[i] > scores[i + 1]) {
                    int temporary = scores[i];
                    scores[i] = scores[i + 1];
                    scores[i + 1] = temporary;
                }
            }
        }

        System.out.println("Scores from lowest to highest: "
                + Arrays.toString(scores));
    }
}`,
      output: 'Scores from lowest to highest: [68, 72, 80, 88, 95]',
      notes: ['Compare neighboring values.', 'Swap them when the left value is greater.', 'After one pass, the largest remaining value reaches the end.', 'Repeat passes until the array is sorted.']
    },
    insertion: {
      title: 'Keep student quiz scores sorted using Insertion Sort',
      code: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = {78, 92, 65, 88, 71};

        // Start at index 1 because one item by itself is already sorted.
        for (int i = 1; i < scores.length; i++) {
            int key = scores[i];       // Save the value to insert.
            int j = i - 1;             // Look left through the sorted prefix.

            // Shift every value larger than key one position to the right.
            while (j >= 0 && scores[j] > key) {
                scores[j + 1] = scores[j];
                j--;
            }

            // Put key into the gap created by shifting.
            scores[j + 1] = key;
        }

        System.out.println("Scores in ascending order: "
                + Arrays.toString(scores));
    }
}`,
      output: 'Scores in ascending order: [65, 71, 78, 88, 92]',
      notes: ['The array stores five quiz scores in their original order.', 'The outer loop starts at index 1; the first item alone is already a sorted prefix.', 'key temporarily saves the value that must be inserted.', 'The while loop shifts larger values right until it finds the correct gap.', 'scores[j + 1] = key inserts the saved value into that gap.', 'The algorithm repeats until every score belongs to the sorted prefix.']
    },
    selection: {
      title: 'Arrange student quiz scores using Selection Sort',
      code: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = {78, 92, 65, 88, 71};

        // Each pass fills the first position of the unsorted section.
        for (int i = 0; i < scores.length - 1; i++) {
            int minIndex = i; // Assume this is the smallest value.

            // Search the rest of the unsorted section for a smaller score.
            for (int j = i + 1; j < scores.length; j++) {
                if (scores[j] < scores[minIndex]) {
                    minIndex = j;
                }
            }

            // Swap the smallest score into its final position.
            int temp = scores[i];
            scores[i] = scores[minIndex];
            scores[minIndex] = temp;
        }

        System.out.println("Scores in ascending order: "
                + Arrays.toString(scores));
    }
}`,
      output: 'Scores in ascending order: [65, 71, 78, 88, 92]',
      notes: ['The outer loop marks the first position that is not sorted yet.', 'minIndex remembers where the smallest value is currently located.', 'The inner loop checks every remaining value in the unsorted section.', 'Only after the scan finishes does the algorithm swap the minimum into position i.', 'That position is now final, so the next pass begins one index later.', 'The final array is in ascending order.']
    },
  };
  if (topicKey === 'arraylist') return { title: 'Product inventory using an ArrayList', code: INVENTORY_JAVA_CODE,
    output: `=== ALL PRODUCTS ===\nP001 | Keyboard | Electronics | Logitech | Wireless keyboard\nP002 | Notebook | School Supplies | PaperMate | A5 ruled notebook\nP003 | Water Bottle | Accessories | Hydro | Reusable 750ml bottle\n\n=== SEARCH RESULT ===\nP002 | Notebook | School Supplies | PaperMate | A5 ruled notebook\n\n=== FINAL INVENTORY ===\nP002 | Hardcover Notebook | School Supplies | PaperMate | A5 hardcover ruled notebook\nP003 | Water Bottle | Accessories | Hydro | Reusable 750ml bottle\n\nTotal products: 2`,
    notes: ['Product is a class: each object groups related fields into one unit.', 'ArrayList<Product> stores multiple Product objects in insertion order.', 'add() appends a new object. The index is assigned automatically.', 'Search loops through the list and compares product IDs.', 'Update changes fields on the matching object.', 'Delete removes the matching index; later elements shift left.'] };
  if (examples[topicKey]) return examples[topicKey];
  const body = (topic.real?.c || (topic.code || []).join('\n') || '// Add the lesson operation here.').split('\n').map(line => '        ' + line).join('\n');
  return { title: topic.real?.t || `A complete ${topic.name} Java example`,
    code: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`,
    output: 'Run the program to observe the values printed by this example.',
    notes: ['The import statement makes Java utility collection classes available.', 'main() is the entry point where the program starts.', 'The statements inside main() create and operate on the data structure.', 'Read each comment, predict the result, then run the program.'] };
}


function InventoryTracker() {
  const starter = [
    { id: 'P001', name: 'Keyboard', category: 'Electronics', brand: 'Logitech', description: 'Wireless keyboard' },
    { id: 'P002', name: 'Notebook', category: 'School Supplies', brand: 'PaperMate', description: 'A5 ruled notebook' },
    { id: 'P003', name: 'Water Bottle', category: 'Accessories', brand: 'Hydro', description: 'Reusable 750ml bottle' }
  ];
  const emptyForm = { id: '', name: '', category: '', brand: '', description: '' };
  const [products, setProducts] = useState(starter);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('add');
  const [message, setMessage] = useState('Your inventory is ready. Add a product, select one to edit, or remove an item.');
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [before, setBefore] = useState(starter);
  const [after, setAfter] = useState(starter);
  const [operation, setOperation] = useState('Initial inventory');
  const [steps, setSteps] = useState(['The ArrayList starts with three Product objects.', 'Each product is stored at an index beginning at 0.']);
  const [showCode, setShowCode] = useState(false);

  const visible = products.filter(p => `${p.id} ${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(search.toLowerCase()));
  const setField = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const record = (title, oldList, newList, explanation) => {
    setBefore(oldList.map(p => ({...p})));
    setAfter(newList.map(p => ({...p})));
    setOperation(title);
    setSteps(explanation);
    setHistory(old => [{ title, detail: explanation[explanation.length - 1] }, ...old].slice(0, 8));
  };
  const submit = () => {
    const id = form.id.trim().toUpperCase();
    const name = form.name.trim();
    if (!id || !name) { setMessage('Please enter at least a Product ID and Product Name.'); return; }
    if (mode === 'add') {
      if (products.some(p => p.id.toLowerCase() === id.toLowerCase())) { setMessage(`Product ID ${id} already exists. Use Update instead.`); return; }
      const old = products;
      const next = [...products, { ...form, id, name }];
      setProducts(next);
      record('Add product', old, next, [`Check whether ${id} already exists.`, `Create a Product object containing its ID, name, category, brand, and description.`, `Call products.add(product). The new object is placed at index ${next.length - 1}.`, `The ArrayList now contains ${next.length} product(s).`]);
      setMessage(`${name} was added successfully. Would you like to add another product or search the inventory?`);
      setForm(emptyForm);
    } else {
      const index = products.findIndex(p => p.id.toLowerCase() === id.toLowerCase());
      if (index < 0) { setMessage(`Cannot update: ${id} was not found. Try Add Product instead.`); return; }
      const old = products;
      const next = products.map((p, i) => i === index ? { ...p, ...form, id, name } : p);
      setProducts(next);
      record('Update product', old, next, [`Search the ArrayList for Product ID ${id}.`, `A matching product was found at index ${index}.`, `Replace the selected object's details while keeping its position in the ArrayList.`, `The updated product is now visible in the inventory.`]);
      setMessage(`${id} was updated. You can now add a new product or delete an item you no longer need.`);
      setMode('add');
      setForm(emptyForm);
      setSelectedId('');
    }
  };
  const chooseEdit = product => {
    setMode('update'); setSelectedId(product.id); setForm({ ...product });
    setMessage(`Editing ${product.id}. Change any fields, then choose Save Changes.`);
  };
  const remove = id => {
    const old = products;
    const index = products.findIndex(p => p.id === id);
    if (index < 0) { setMessage(`${id} was not found.`); return; }
    const next = products.filter(p => p.id !== id);
    setProducts(next);
    record('Delete product', old, next, [`Scan the ArrayList until Product ID ${id} is found.`, `The product is located at index ${index}.`, `Call products.remove(${index}). The object is removed from that position.`, `Any later elements shift one index to the left. The list now has ${next.length} product(s).`]);
    setMessage(`${id} was deleted. Consider adding a replacement product if the inventory is incomplete.`);
    if (selectedId === id) { setSelectedId(''); setForm(emptyForm); setMode('add'); }
  };
  const reset = () => {
    setProducts(starter); setBefore(starter); setAfter(starter); setOperation('Reset inventory');
    setSteps(['Restore the three sample Product objects.', 'The ArrayList is ready for another practice run.']);
    setMessage('Inventory restored to the original sample products.'); setHistory([]);
    setForm(emptyForm); setMode('add'); setSearch('');
  };
  const suggestions = products.length === 0
    ? 'Your inventory is empty. Add your first product to get started.'
    : products.length < 3
      ? 'Your inventory has only a few products. Try adding another product.'
      : 'Try searching for P002, updating a product, or deleting P001 to see how ArrayList changes.';
  const ProductList = ({items, title}) => <div className="space-y-2"><div className="text-xs font-bold text-slate-500">{title}</div>{items.length ? items.map((p,i)=><div key={p.id} className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">{i}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-xs">{p.name}</b><span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">{p.id}</span></div><p className="mt-1 text-[11px] text-slate-500">{p.category || 'No category'} · {p.brand || 'No brand'}</p><p className="mt-1 break-words text-[11px] text-slate-400">{p.description || 'No description'}</p></div></div>) : <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">No products in this ArrayList.</div>}</div>;
  return <div className="space-y-5">
    <Card>
      <SectionTitle eyebrow="ArrayList · Real application simulation" title="Product inventory manager" description="Practice ArrayList operations using meaningful product information. No price or quantity fields: focus on how objects are added, found, updated, and removed."/>
      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-500/10"><div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-200"><Lightbulb size={15}/> Suggested next action</div><p className="mt-1 text-sm leading-6 text-blue-950 dark:text-blue-100">{suggestions}</p><div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>{setMode('add');setForm(emptyForm);}} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">+ Add a product</button><button onClick={()=>{setSearch('');setMessage('Choose a product below and click Delete to remove it.');}} className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-200">Review products to delete</button></div></div>
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">{mode === 'add' ? 'Add a product' : `Update ${selectedId}`}</h3><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{mode === 'add' ? 'Create operation' : 'Update operation'}</span></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[['id','Product ID','P004'],['name','Product Name','Wireless Mouse'],['category','Category','Electronics'],['brand','Brand','Logitech']].map(([key,label,placeholder])=><label key={key} className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}<input value={form[key]} onChange={e=>setField(key,e.target.value)} placeholder={placeholder} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900"/></label>)}
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:col-span-2">Description<textarea value={form.description} onChange={e=>setField('description',e.target.value)} rows={2} placeholder="Describe the product..." className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900"/></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={submit} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">{mode === 'add' ? '+ Add Product' : 'Save Changes'}</button><button onClick={()=>{setMode('add');setSelectedId('');setForm(emptyForm);}} className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold dark:border-slate-700">Clear form</button></div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">Current ArrayList <span className="ml-1 text-xs font-normal text-slate-400">({products.length} products)</span></h3><button onClick={reset} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] font-semibold dark:border-slate-700"><RotateCcw size={12}/> Reset sample</button></div>
          <label className="relative block"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID, name, category, or brand..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900"/></label>
          <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">{visible.length ? visible.map((p,i)=><div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"><div className="flex flex-wrap items-start justify-between gap-2"><div className="flex min-w-0 gap-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">{products.findIndex(x=>x.id===p.id)}</span><div className="min-w-0"><b className="text-xs">{p.name}</b><p className="text-[10px] text-slate-400">{p.id} · {p.category} · {p.brand}</p><p className="mt-1 text-[11px] text-slate-500">{p.description}</p></div></div><div className="flex shrink-0 gap-1"><button onClick={()=>chooseEdit(p)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-semibold dark:border-slate-700">Edit</button><button onClick={()=>remove(p.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-[10px] font-semibold text-rose-600 dark:border-rose-900">Delete</button></div></div></div>) : <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-xs text-slate-400 dark:border-slate-700">No matching products. Try another search or add a product.</p>}</div>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white"><div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Application response</div><p className="mt-1 text-sm leading-6">{message}</p></div>
    </Card>
    <Card>
      <SectionTitle eyebrow="Algorithm trace" title={`How ${operation} changed the ArrayList`} description="Compare the collection before and after the selected operation, then read the logic in order."/>
      <div className="grid gap-4 md:grid-cols-2"><div><ProductList items={before} title="BEFORE OPERATION"/></div><div><ProductList items={after} title="AFTER OPERATION"/></div></div>
      <div className="mt-4 space-y-2">{steps.map((step,i)=><div key={i} className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">{i+1}</span><p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{step}</p></div>)}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><b className="text-xs">Time complexity</b><p className="mt-1 text-xs leading-5 text-slate-500">Add at end: amortized O(1). Search by ID: O(n). Delete by index: O(n) because later elements shift left.</p></div><div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><b className="text-xs">What to notice</b><p className="mt-1 text-xs leading-5 text-slate-500">An ArrayList stores objects in indexed order. Deleting one element from the middle shifts later references one position to the left.</p></div></div>
    </Card>
    <Card><div className="flex flex-wrap items-center justify-between gap-2"><SectionTitle eyebrow="Complete Java source" title="The same inventory logic in Java" description="This is a complete console program, not an isolated snippet. It includes the Product class, ArrayList, search, update, delete, and display logic."/></div><button onClick={()=>setShowCode(!showCode)} className="mb-3 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-blue-600">{showCode?'Hide complete source':'Show complete Java source'}</button>{showCode&&<pre className="code-font max-h-[650px] overflow-auto rounded-xl bg-[#0b1220] p-4 text-[11px] leading-6 text-blue-100"><code>{INVENTORY_JAVA_CODE}</code></pre>}</Card>
  </div>;
}

function App() {
  const [current, setCurrent] = useState('stack');
  const [tab, setTab] = useState('learn');
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('algolearn-completed') || '[]'));
  const [openGroups, setOpenGroups] = useState(['Data Structures','Java Collections','Algorithms','Advanced Systems']);
  const topic = TOPICS[current] || TOPICS.stack;
  const allTopics = Object.entries(TOPICS);
  const groups = useMemo(() => GROUP_ORDER.map(group => ({ group, items: allTopics.filter(([,t]) => t.group === group) })).filter(x => x.items.length), []);
  const filtered = groups.map(g => ({...g, items:g.items.filter(([key,t]) => `${t.name} ${t.simple} ${t.group}`.toLowerCase().includes(query.toLowerCase()))})).filter(g => g.items.length);
  const index = allTopics.findIndex(([k]) => k === current);
  const next = allTopics[index + 1];
  const prev = allTopics[index - 1];
  const isDone = completed.includes(current);
  const markDone = () => { const nextDone = isDone ? completed.filter(x => x !== current) : [...completed,current]; setCompleted(nextDone); localStorage.setItem('algolearn-completed',JSON.stringify(nextDone)); };
  const selectTopic = key => { setCurrent(key); setTab('learn'); setMobileNav(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const Icon = GROUP_ICON[topic.group] || BookOpen;
  const pct = Math.round(completed.length / Math.max(allTopics.length,1) * 100);

  return <div className={dark ? 'dark' : ''}>
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 transition-colors dark:bg-[#0b1220] dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0d1727]/90">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><button onClick={()=>setMobileNav(!mobileNav)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={20}/></button><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-lg shadow-blue-500/20"><BrainCircuit size={20}/></div><div><div className="font-['Space_Grotesk'] text-[17px] font-bold tracking-tight">Algo<span className="text-blue-600">Learn</span></div><div className="-mt-1 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">Java DSA Learning Hub</div></div></div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 md:flex dark:border-slate-700 dark:bg-slate-800/70"><Command size={13}/> Learn by understanding, then by doing</div>
          <div className="flex items-center gap-2"><div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex dark:bg-emerald-500/10 dark:text-emerald-300"><Trophy size={14}/> {completed.length}/{allTopics.length} completed</div><button aria-label="Toggle theme" onClick={()=>setDark(!dark)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">{dark?<Sun size={17}/>:<Moon size={17}/>}</button></div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <aside className={`${mobileNav?'fixed top-[68px] bottom-0 left-0 z-30 block w-[290px] shadow-2xl':'hidden'} w-[290px] shrink-0 overflow-y-auto overscroll-y-contain border-r border-slate-200 bg-white lg:sticky lg:top-[68px] lg:block lg:h-[calc(100vh-68px)] lg:overflow-y-auto dark:border-slate-800 dark:bg-[#0e1929]`}>
          <div className="p-5"><div className="mb-4 flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">Your curriculum</span><button onClick={()=>setMobileNav(false)} className="lg:hidden"><X size={17}/></button></div>
            <div className="relative mb-5"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a topic..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800"/></div>
            <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#142b50] to-[#2454a4] p-4 text-white"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-blue-100">Learning progress</span><Sparkles size={15} className="text-amber-300"/></div><div className="mb-2 flex items-end gap-1"><span className="font-['Space_Grotesk'] text-3xl font-bold">{pct}%</span><span className="pb-1 text-xs text-blue-100">completed</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-emerald-300 transition-all" style={{width:`${pct}%`}}/></div><div className="mt-2 text-[10px] text-blue-100">Keep going — every concept builds on the last.</div></div>
            <nav className="space-y-5">{filtered.map(({group,items})=>{const GIcon=GROUP_ICON[group]||BookOpen;const expanded=openGroups.includes(group)||query.length>0;return <section key={group}><button onClick={()=>setOpenGroups(v=>v.includes(group)?v.filter(x=>x!==group):[...v,group])} className="mb-2 flex w-full items-center justify-between px-2 text-left"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-slate-400"><GIcon size={13}/>{prettyGroup(group)}</span><ChevronDown size={14} className={`text-slate-400 transition ${expanded?'':'-rotate-90'}`}/></button>{expanded&&<div className="space-y-1">{items.map(([key,t])=><button key={key} onClick={()=>selectTopic(key)} className={`nav-item group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${current===key?'active bg-blue-50 font-semibold text-blue-700':'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><span className={`h-1.5 w-1.5 rounded-full ${completed.includes(key)?'bg-emerald-500':current===key?'bg-blue-500':'bg-slate-300'}`}/><span className="min-w-0 flex-1 truncate">{t.name}</span>{completed.includes(key)&&<Check size={14} className="text-emerald-500"/>}</button>)}</div>}</section>})}</nav>
            <div className="mt-8 rounded-xl border border-slate-200 p-3 dark:border-slate-700"><div className="mb-1 flex items-center gap-2 text-xs font-semibold"><GraduationCap size={15} className="text-blue-500"/> Study tip</div><p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Read the concept, predict what the code will do, then run the visual tracker. Explaining it in your own words is a powerful test.</p></div>
          </div>
        </aside>
        {mobileNav&&<button aria-label="Close navigation" onClick={()=>setMobileNav(false)} className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"/>}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-5 flex items-center gap-2 text-xs text-slate-400"><span>Curriculum</span><ChevronRight size={13}/><span>{prettyGroup(topic.group)}</span><ChevronRight size={13}/><span className="font-semibold text-slate-600 dark:text-slate-300">{topic.name}</span></div>
            <section className="relative mb-6 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#142a4c] via-[#1b3b6b] to-[#315eb3] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8"><div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/[.045]"/><div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full border-[30px] border-white/[.04]"/><div className="relative"><div className="mb-4 flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-blue-100">{topic.group}</span><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-semibold text-emerald-200">Beginner friendly</span></div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-2xl"><h1 className="mb-3 font-['Space_Grotesk'] text-3xl font-bold tracking-tight sm:text-[42px]">{topic.name}</h1><p className="max-w-2xl text-sm leading-7 text-blue-100 sm:text-[15px]">{topic.simple}</p></div><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner"><Icon size={30}/></div></div><div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-blue-100"><span className="flex items-center gap-1.5"><Clock3 size={13}/> 8–15 min</span><span className="flex items-center gap-1.5"><BookOpen size={13}/> Concept + examples</span><span className="flex items-center gap-1.5"><Target size={13}/> Practice included</span></div></div></section>
            <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-[#121c2d]">{[{id:'learn',label:'Learn',icon:BookOpen},{id:'example',label:'Real-world example',icon:Compass},{id:'visual',label:'Visual tracker',icon:Play},{id:'quiz',label:'Knowledge check',icon:CircleHelp},{id:'practice',label:'Practice',icon:ListChecks}].map(({id,label,icon:TabIcon})=><button key={id} onClick={()=>setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition sm:px-4 ${tab===id?'bg-blue-600 text-white shadow-md shadow-blue-600/20':'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'}`}><TabIcon size={15}/>{label}</button>)}</div>
            {tab==='learn'&&<LearnPanel topic={topic} theory={theoryFor(topic,current)}/>}
            {tab==='example'&&<ExamplePanel topic={topic} topicKey={current}/>}
            {tab==='visual'&&<TrackerPanel topic={topic} topicKey={current}/>}
            {tab==='quiz'&&<QuizPanel quiz={QUIZZES[current]||topic.qz}/>}
            {tab==='practice'&&<PracticePanel quiz={QUIZZES[current]||topic.qz}/>}
            <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center dark:border-slate-800"><button onClick={markDone} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${isDone?'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-900':'bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900'}`}>{isDone?<Check size={15}/>:<Trophy size={15}/>} {isDone?'Completed — mark unfinished':'Mark topic as completed'}</button><div className="flex gap-2">{prev&&<button onClick={()=>selectTopic(prev[0])} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ArrowLeft size={14}/> Previous</button>}{next&&<button onClick={()=>selectTopic(next[0])} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-700">Next lesson <ArrowRight size={14}/></button>}</div></div>
            <footer className="mt-8 pb-5 text-center text-[11px] text-slate-400">AlgoLearn · Learn the idea, understand the trade-offs, write the code.</footer>
          </div>
        </main>
      </div>
    </div>
  </div>;
}

function SectionTitle({eyebrow,title,description}) { return <div className="mb-4"><div className="mb-1 text-[10px] font-bold uppercase tracking-[.15em] text-blue-600">{eyebrow}</div><h2 className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>{description&&<p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>}</div>; }
function Card({children,className=''}) { return <section className={`surface rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>; }
function LearnPanel({topic:t,theory}) { return <div className="space-y-5">
  <div className="grid gap-5 lg:grid-cols-[1.35fr_.9fr]"><Card><SectionTitle eyebrow="Core concept" title="What you need to understand"/><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{theory.theory}</p><div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-blue-50/80 p-4 dark:bg-blue-500/10"><div className="mb-1 flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-200"><Lightbulb size={14}/> Mental model</div><p className="text-sm leading-6 text-blue-900/80 dark:text-blue-100/80">{theory.model}</p></div><div className="mt-5"><h3 className="mb-2 text-sm font-bold">How it works</h3><ol className="space-y-2">{(t.how||[]).map((x,i)=><li key={i} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{i+1}</span><span>{x}</span></li>)}</ol></div></Card>
  <div className="space-y-5"><Card><SectionTitle eyebrow="Under the hood" title="How it is represented"/><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{theory.representation}</p></Card><Card><SectionTitle eyebrow="Performance" title="Complexity at a glance"/><div className="flex flex-wrap gap-2">{(t.cx||[]).map((x,i)=><span key={i} className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{x}</span>)}</div><p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Big-O describes how an operation’s work grows as the input size n increases. It focuses on growth, not exact milliseconds.</p><div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Common growth rates</div><div className="space-y-2 text-xs">{[['O(1)','Constant'],['O(log n)','Logarithmic'],['O(n)','Linear'],['O(n log n)','Linearithmic'],['O(n²)','Quadratic']].map(([a,b])=><div className="flex items-center justify-between" key={a}><code className="code-font font-bold text-slate-700 dark:text-slate-200">{a}</code><span className="text-slate-400">{b}</span></div>)}</div></div></Card></div></div>
  <div className="grid gap-5 lg:grid-cols-2"><Card><SectionTitle eyebrow="Choose wisely" title="When should you use it?"/><ul className="space-y-2">{(t.when||[]).map((x,i)=><li key={i} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><Check size={16} className="mt-1 shrink-0 text-emerald-500"/>{x}</li>)}</ul><div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700"><div className="mb-2 text-xs font-bold">Performance trade-off</div><p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{theory.tradeoff}</p></div></Card><Card><SectionTitle eyebrow="Vocabulary" title="Key terms to remember"/><div className="space-y-3">{theory.terms.map(([term,desc])=><div key={term} className="flex gap-3"><span className="min-w-[100px] text-xs font-bold text-slate-800 dark:text-slate-200">{term}</span><span className="text-xs leading-5 text-slate-500 dark:text-slate-400">{desc}</span></div>)}</div></Card></div>
  <Card><SectionTitle eyebrow="Avoid these mistakes" title="Common beginner pitfalls"/><div className="grid gap-3 sm:grid-cols-2">{theory.pitfalls.map((x,i)=><div key={i} className="flex gap-2 rounded-xl bg-amber-50/80 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"><span className="font-bold">0{i+1}</span>{x}</div>)}</div></Card>
  <Card><SectionTitle eyebrow="Connect the dots" title="Try explaining it in your own words" description="A quick retrieval-practice prompt. Pause before reading the lesson again."/><ExplainPrompt topic={t}/></Card>
</div>; }
function ExplainPrompt({topic}) { const [answer,setAnswer]=useState(''); const [show,setShow]=useState(false); return <div><p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">{topic.group==='Algorithms'?`Why is ${topic.name} appropriate for some inputs but not all?`:`What rule does ${topic.name} follow, and what kind of problem does that rule help solve?`}</p><textarea value={answer} onChange={e=>setAnswer(e.target.value)} rows={3} placeholder="Write a short explanation in your own words..." className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800"/><button onClick={()=>setShow(!show)} className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-blue-600">{show?'Hide reflection hint':'Show reflection hint'}</button>{show&&<p className="mt-3 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-900 dark:bg-blue-500/10 dark:text-blue-100">A strong explanation mentions the rule, the operations it supports, and one limitation or trade-off. Use a concrete example rather than memorizing a definition.</p>}</div>; }
function ExamplePanel({topic:t,topicKey}) {
  const example = completeJavaExample(topicKey,t);
  const [showCode,setShowCode] = useState(true);
  const [showNotes,setShowNotes] = useState(true);
  return <div className="space-y-5">
    <Card>
      <SectionTitle eyebrow="Applied learning · Complete Java program" title={example.title} description={t.real?.x || t.simple}/>
      <div className="grid gap-3 sm:grid-cols-3">
        {[['Problem','What real application needs to do'],['Data structure',t.name],['Goal','Connect the concept to working Java code']].map(([a,b])=><div key={a} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{a}</div><div className="mt-1 text-xs font-semibold">{b}</div></div>)}
      </div>
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-500/10">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-200"><Lightbulb size={14}/> Why this data structure?</div>
        <p className="text-sm leading-6 text-blue-950 dark:text-blue-100">{t.simple} The application uses this behavior to organize information and perform the required operations.</p>
      </div>
    </Card>
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3"><SectionTitle eyebrow="Full source code" title="Complete Java implementation" description="Includes imports, the Main class, main() method, data setup, operations, and output statements."/><button onClick={()=>setShowCode(!showCode)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-slate-700">{showCode?'Hide code':'Show full code'}</button></div>
      {showCode&&<div className="overflow-hidden rounded-xl bg-[#0b1220]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="flex items-center gap-2 text-xs font-semibold text-slate-200"><Terminal size={14} className="text-emerald-400"/> Main.java</span><span className="text-[10px] text-slate-400">Complete example</span></div><pre className="code-font max-h-[720px] overflow-auto p-4 text-[11px] leading-6 text-blue-100"><code>{example.code}</code></pre></div>}
      <div className="mt-4"><div className="mb-2 text-xs font-bold">How to run this program</div><ol className="space-y-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400"><li>1. Create a Java project or open your IDE.</li><li>2. Create a file named <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">Main.java</code>.</li><li>3. Copy the complete source code into the file.</li><li>4. Run the Main class and compare the console output.</li></ol></div>
    </Card>
    <Card>
      <SectionTitle eyebrow="Program walkthrough" title="Understand the logic step by step" description="Read the source from top to bottom. Each stage has a specific responsibility."/>
      <div className="space-y-3">{example.notes.map((note,i)=><div key={i} className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">{i+1}</span><p className="text-xs leading-6 text-slate-600 dark:text-slate-300">{note}</p></div>)}</div>
    </Card>
    <Card>
      <SectionTitle eyebrow="Expected result" title="Sample console output"/>
      <pre className="code-font overflow-x-auto rounded-xl bg-[#0b1220] p-4 text-xs leading-6 text-emerald-300"><code>{example.output}</code></pre>
      <p className="mt-3 text-xs leading-5 text-slate-500">Your exact output may vary if you change the sample data or operations. Use this output to check whether you understand the program flow.</p>
    </Card>
    <div className="grid gap-5 md:grid-cols-2">
      <Card><SectionTitle eyebrow="Design thinking" title="Why this implementation?"/><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{t.simple} The key is matching the structure's rules to the application's needs. Before choosing a structure, ask which operations happen most often and what ordering or uniqueness rules the application requires.</p></Card>
      <Card><SectionTitle eyebrow="Think like a developer" title="Questions to ask"/><ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>• Which operation happens most often?</li><li>• Does the order of elements matter?</li><li>• Are duplicate values allowed?</li><li>• What should happen when the structure is empty?</li><li>• How should the program respond when a searched item is missing?</li></ul></Card>
    </div>
  </div>;
}
const ALGO_POINTER_TONE = {
  i: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
  j: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  mid: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  high: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  minIndex: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-200'
};
const ALGO_BADGE = {
  init: ['Starting point', 'slate'], start: ['Starting point', 'slate'], visit: ['Inspecting index', 'blue'],
  compare: ['Comparing values', 'blue'], swap: ['Swapping cells', 'amber'], shift: ['Shifting right', 'amber'],
  insert: ['Inserting key', 'violet'], key: ['Holding key', 'violet'], narrow: ['Half discarded', 'sky'],
  range: ['Searching this range', 'sky'], pass: ['Pass finished', 'emerald'], keep: ['No swap needed', 'emerald'],
  found: ['Target found', 'emerald'], miss: ['Target not found', 'rose'], done: ['Array sorted', 'emerald']
};
const ALGO_TONE = {
  slate: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-500/10 dark:text-blue-300',
  sky: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-500/10 dark:text-sky-300',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-500/10 dark:text-amber-300',
  violet: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-500/10 dark:text-violet-300',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-300',
  rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-300'
};
function AlgorithmTracker({topic:t, topicKey}) {
  const search = topicKey === 'linear' || topicKey === 'binary';
  const [values, setValues] = useState(t.inp?.arr || '7,3,9,4,1');
  const [targetText, setTargetText] = useState(String(t.inp?.target ?? '4'));
  const [steps, setSteps] = useState([]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState('');
  const logBox = useRef(null);

  const build = (rawValues = values, rawTarget = targetText) => {
    try {
      const list = String(rawValues).split(',').map(x => x.trim()).filter(x => x !== '').map(Number);
      if (!list.length) throw new Error('Enter at least one number.');
      if (list.length > 12) throw new Error('Use at most 12 numbers so the animation stays readable.');
      if (list.some(Number.isNaN)) throw new Error('Use numbers separated by commas, for example 7,3,9,4,1.');
      if (search && String(rawTarget).trim() === '') throw new Error('Enter a numeric target value.');
      if (search && Number.isNaN(Number(rawTarget))) throw new Error('The target must be a number.');
      if (topicKey === 'binary') list.sort((a,b) => a - b);
      const trace = t.gen?.(list, Number(rawTarget)) || [];
      if (!trace.length) throw new Error('This lesson has no recorded trace.');
      setSteps(trace); setPos(0); setPlaying(false); setError('');
    } catch (e) {
      setSteps([]); setPlaying(false); setError(e.message || 'Unable to build the trace.');
    }
  };

  useEffect(() => { build(t.inp?.arr || '', String(t.inp?.target ?? '')); }, [topicKey]);

  const last = steps.length - 1;
  useEffect(() => {
    if (!playing) return;
    if (pos >= last) { setPlaying(false); return; }
    const id = setTimeout(() => setPos(p => Math.min(p + 1, last)), 1000 / speed);
    return () => clearTimeout(id);
  }, [playing, pos, speed, last]);

  const active = steps[pos];
  useEffect(() => {
    const node = logBox.current?.querySelector('[data-current="true"]');
    if (node) node.scrollIntoView({ block: 'nearest' });
  }, [pos, steps.length]);

  const move = dir => { setPlaying(false); setPos(p => Math.min(Math.max(p + dir, 0), Math.max(last, 0))); };
  const resetInputs = () => { const a = t.inp?.arr || '7,3,9,4,1'; const b = String(t.inp?.target ?? '4'); setValues(a); setTargetText(b); build(a, b); };
  const tone = i => {
    const done = active?.done?.includes(i);
    const hot = active?.hi?.includes(i);
    if (active?.k === 'found' && done) return 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30';
    if (done) return 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200';
    if (hot) return 'border-blue-500 bg-blue-100 text-blue-900 shadow-lg shadow-blue-500/20 dark:border-blue-500 dark:bg-blue-500/25 dark:text-blue-50';
    return 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';
  };
  const anim = i => {
    const flip = pos % 2 ? 'a' : 'b';
    if (active?.k === 'swap' && active?.hi?.includes(i)) return `algo-swap-${flip}`;
    if (active?.k === 'found' && active?.done?.includes(i)) return `algo-found-${flip}`;
    if (active?.hi?.includes(i)) return `algo-focus-${flip}`;
    return '';
  };
  const pointers = i => {
    const p = active?.ptr;
    if (!p) return [];
    return Object.entries(p).filter(([name, idx]) => name !== 'key' && idx === i && ALGO_POINTER_TONE[name]).map(([name]) => name);
  };
  const badge = ALGO_BADGE[active?.k] || ['Executing line', 'slate'];

  return <div className="space-y-5">
    <Card>
      <SectionTitle eyebrow="Watch the algorithm" title="Live debugger" description="Generate a trace, then play it back. Each step replays one decision the algorithm makes: compare, swap, discard, insert."/>
      <div className="flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
        <label className="min-w-[190px] flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Input values<input value={values} onChange={e=>setValues(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900"/></label>
        {search&&<label className="w-28 text-xs font-semibold text-slate-600 dark:text-slate-300">Target<input value={targetText} onChange={e=>setTargetText(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900"/></label>}
        <button onClick={()=>build()} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Generate trace</button>
        <button onClick={resetInputs} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Lesson defaults</button>
      </div>
      {error&&<div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button aria-label="Restart trace" onClick={()=>{setPlaying(false);setPos(0);}} disabled={!steps.length} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><RotateCcw size={14}/></button>
        <button aria-label="Previous step" onClick={()=>move(-1)} disabled={!steps.length||pos===0} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><SkipBack size={14}/></button>
        <button onClick={()=>{ if(!steps.length) return; if(pos>=last) setPos(0); setPlaying(p=>!p); }} disabled={!steps.length} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-40">{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pause':'Play trace'}</button>
        <button aria-label="Next step" onClick={()=>move(1)} disabled={!steps.length||pos>=last} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><SkipForward size={14}/></button>
        <button onClick={()=>setSpeed(s=>s===1?2:s===2?0.5:1)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" title="Playback speed">{speed}×</button>
        <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">Step {steps.length?pos+1:0} of {steps.length}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{width:`${steps.length?((pos+1)/steps.length)*100:0}%`}}/></div>
      {active?<div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ALGO_TONE[badge[1]]}`}><span className={`h-1.5 w-1.5 rounded-full ${playing?'animate-pulse':''} bg-current`}/>{badge[0]}</span>
            {search&&<span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">target = {targetText}</span>}
            {active.ptr?.key!=null&&<span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 dark:border-violet-900 dark:bg-violet-500/10 dark:text-violet-300">held key = {active.ptr.key}</span>}
          </div>
          <div className="mt-4 flex items-end gap-1.5 overflow-x-auto pb-1">
            {active.items.map((v,i)=><div key={i} className="flex shrink-0 flex-col items-center gap-1">
              <div className="flex h-4 items-center gap-0.5">{pointers(i).map(name=><span key={name} className={`code-font rounded px-1 text-[9px] font-bold leading-4 ${ALGO_POINTER_TONE[name]}`}>{name}</span>)}</div>
              <div className={`${anim(i)} flex h-14 w-14 items-center justify-center rounded-xl border-2 font-['Space_Grotesk'] text-lg font-bold shadow-sm transition-all duration-300 ${tone(i)} ${active.rng&&(i<active.rng[0]||i>active.rng[1])?'opacity-25 grayscale':''}`}>{v}</div>
              <div className="code-font text-[10px] font-semibold text-slate-400">{i}</div>
            </div>)}
          </div>
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/80 p-3 dark:border-blue-900 dark:bg-blue-500/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Debugger says</div>
            <p className="mt-1 text-sm leading-6 text-blue-950 dark:text-blue-100">{active.log}</p>
          </div>
          {active.vars&&<div className="mt-3 flex flex-wrap gap-1.5">{String(active.vars).split(',').map((v,i)=><span key={i} className="code-font rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{v.trim()}</span>)}</div>}
        </div>
        <div className="overflow-hidden rounded-2xl bg-[#0b1220] ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300"><Terminal size={12} className="text-emerald-400"/> Execution log</span><span className="text-[10px] text-slate-500">{pos+1}/{steps.length}</span></div>
          <div ref={logBox} className="max-h-[300px] space-y-0.5 overflow-y-auto p-2">{steps.map((s,i)=>{
            const current = i===pos, future = i>pos;
            return <button key={i} data-current={current} onClick={()=>{setPlaying(false);setPos(i);}} className={`algo-log-row flex w-full gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] leading-5 transition ${current?'bg-blue-500/15 text-blue-100 ring-1 ring-inset ring-blue-400/40':future?'text-slate-500 hover:bg-white/5':'text-slate-300 hover:bg-white/5'}`}>
              <span className={`w-5 shrink-0 text-right font-bold ${current?'text-blue-300':'text-slate-600'}`}>{i+1}</span>
              <span className="min-w-0 flex-1">{s.log}</span>
            </button>;
          })}</div>
        </div>
      </div>:<p className="mt-5 rounded-xl border border-dashed border-slate-300 p-5 text-center text-xs text-slate-400 dark:border-slate-700">Enter numbers and press Generate trace to start the debugger.</p>}
    </Card>
    {t.code&&<Card><SectionTitle eyebrow="Source code" title="Java implementation" description="The animated marker follows the exact line the debugger is executing."/><div className="code-panel overflow-hidden rounded-xl bg-[#0b1220] p-4">{t.code.map((line,i)=>{const on=active?.lines?.includes(i);return <div key={i} className={`code-font relative flex gap-3 rounded px-2 py-1 text-[11px] leading-5 transition-colors duration-300 ${on?'bg-blue-500/20 text-blue-100':'text-slate-400'}`}><span className={`absolute left-0 top-1/2 -translate-y-1/2 text-[8px] transition-opacity ${on?'text-emerald-400 opacity-100':'opacity-0'}`}>▶</span><span className="w-5 shrink-0 select-none pl-2 text-right text-slate-600">{i+1}</span><code className="whitespace-pre">{line}</code></div>;})}</div></Card>}
  </div>;
}
function TrackerPanel({topic:t,topicKey}) { const [steps,setSteps]=useState([]); const [pos,setPos]=useState(0); const [arr,setArr]=useState(t.inp?.arr||'7,3,9,4,1'); const [target,setTarget]=useState(t.inp?.target||'4'); const [error,setError]=useState(''); const [systemState,setSystemState]=useState(null);
  const isAlgo=['linear','binary','bubble'].includes(topicKey);
  const makeSteps=()=>{try{let values=arr.split(',').map(x=>Number(x.trim())).filter((_,i)=>arr.split(',')[i]?.trim()!=='');if(!values.length||values.length>10||values.some(Number.isNaN))throw new Error('Enter 1–10 comma-separated numbers.');if(isAlgo&&topicKey!=='bubble'&&target.trim()==='')throw new Error('Enter a numeric target.');if(topicKey==='binary'||t.inp?.sort)values.sort((a,b)=>a-b);const nextSteps=t.gen?.(values,Number(target))||t.gen?.()||[];if(!nextSteps.length)throw new Error('This lesson does not have a line-by-line tracker. Use the interactive collection sandbox below.');setSteps(nextSteps);setPos(0);setError('');}catch(e){setError(e.message||'Unable to build the visualization.');}};
  const simpleSteps=()=>{const seed=t.init||{};const first=Object.entries(seed)[0];setSystemState(first?{name:first[0],values:JSON.parse(JSON.stringify(first[1]))}:{name:'items',values:[]});};
  const active=steps[pos];
  if(t.adv) return <AdvancedTracker topic={t}/>;
  if(topicKey === 'arraylist') return <InventoryTracker/>;
  if(t.group === 'Algorithms') return <AlgorithmTracker key={topicKey} topic={t} topicKey={topicKey}/>;
  return <div className="space-y-5"><Card><SectionTitle eyebrow="Watch the algorithm" title="Step-by-step execution" description="Change the sample input, generate the trace, then move through the recorded operations one at a time."/>
    {t.inp&&<div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><label className="min-w-[200px] flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Input values<input value={arr} onChange={e=>setArr(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900"/></label>{t.inp.target&&<label className="w-28 text-xs font-semibold text-slate-600 dark:text-slate-300">Target<input value={target} onChange={e=>setTarget(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900"/></label>}<button onClick={makeSteps} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Generate steps</button></div>}
    {!t.inp&&<div className="mb-5 flex flex-wrap items-center gap-3"><button onClick={()=>{const s=t.gen?.()||[];setSteps(s);setPos(0);setError(s.length?'':'No step trace available for this lesson.')}} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">Generate example</button><span className="text-xs text-slate-400">Uses the lesson’s built-in example values.</span></div>}
    {error&&<div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</div>}
    {active?<><div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Execution timeline</span><span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">Step {pos+1} of {steps.length}</span></div><div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-blue-500 transition-all" style={{width:`${(pos+1)/steps.length*100}%`}}/></div><div className="flex min-h-[115px] flex-wrap items-center justify-center gap-2 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">{active.items?.length?active.items.map((v,i)=><div key={i} className={`min-w-[54px] rounded-xl border px-3 py-3 text-center ${active.done?.includes(i)?'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200':active.hi?.includes(i)?'border-blue-300 bg-blue-100 text-blue-900 dark:border-blue-600 dark:bg-blue-500/20 dark:text-blue-100':'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}><div className="font-['Space_Grotesk'] text-lg font-bold">{v}</div><div className="mt-1 text-[9px] uppercase tracking-wider opacity-60">{active.type==='stack'&&i===active.items.length-1?'top':active.type==='queue'&&i===0?'front':i}</div></div>):<span className="text-sm text-slate-400">Empty structure</span>}</div><div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-500/10"><div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">What is happening?</div><p className="text-sm leading-6 text-blue-950 dark:text-blue-100">{active.log}</p><div className="mt-2 text-[11px] text-blue-800/70 dark:text-blue-200/70">{active.vars&&`Variables: ${active.vars}`}</div></div><div className="mt-4 flex items-center justify-between"><button disabled={pos===0} onClick={()=>setPos(pos-1)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-30 dark:border-slate-700"><ArrowLeft size={14}/> Previous</button><button onClick={()=>setPos(pos===steps.length-1?0:pos+1)} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-blue-600">{pos===steps.length-1?'Restart':'Next step'} <ArrowRight size={14}/></button></div></>:<div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"><Play size={20}/></div><div className="text-sm font-bold">Ready to visualize?</div><p className="mt-1 text-xs text-slate-500">Generate the example to see how the values and variables change at each step.</p></div>}
    </Card>
    {t.code&&<Card><SectionTitle eyebrow="Source code" title="Java implementation" description="Follow the highlighted line in the tracker while reading this code."/><div className="code-panel overflow-hidden rounded-xl bg-[#0b1220] p-4">{t.code.map((line,i)=><div key={i} className={`code-font flex gap-4 rounded px-2 py-1 text-[11px] leading-5 ${active?.lines?.includes(i)?'bg-blue-500/20 text-blue-100':'text-slate-400'}`}><span className="w-5 shrink-0 select-none text-right text-slate-600">{i+1}</span><code className="whitespace-pre">{line}</code></div>)}</div></Card>}
  </div>;
}
function AdvancedTracker({topic:t}) {
  const [state,setState]=useState(()=>Object.fromEntries(t.cols.map(([id])=>[id,JSON.parse(JSON.stringify(t.init?.[id]||[]))])));
  const [x,setX]=useState(''); const [y,setY]=useState(''); const [message,setMessage]=useState('Choose an operation to see how several structures work together.'); const [log,setLog]=useState([]);
  const keyTypes=Object.fromEntries(t.cols.map(c=>[c[0],c[2]]));
  const reset=()=>{setState(Object.fromEntries(t.cols.map(([id])=>[id,JSON.parse(JSON.stringify(t.init?.[id]||[]))])));setLog([]);setMessage('System reset to its starting data.');};
  const cmp=(a,b)=>typeof a==='number'&&typeof b==='number'?a-b:String(a).localeCompare(String(b));
  const label=v=>Array.isArray(v)?`${v[0]} = ${v[1]}`:String(v);
  const put=(next,col,value,extra)=>{const a=next[col],kind=keyTypes[col];if(['map','tmap','pq'].includes(kind)){const i=a.findIndex(z=>z[0]===value),val=extra===''?1:extra;if(i>=0)a[i][1]=val;else a.push([value,val]);if(kind==='tmap')a.sort((u,v)=>cmp(u[0],v[0]));if(kind==='pq')a.sort((u,v)=>cmp(u[1],v[1]));return a.findIndex(z=>z[0]===value);}if(kind==='set'&&a.includes(value))return a.indexOf(value);a.push(value);return a.length-1;};
  const run=(op)=>{const [,type,col,to,code,description,edge,required]=op;const next=JSON.parse(JSON.stringify(state));const a=next[col];let line=code||'';let result='';let focus=col;
    if(type==='f'){const out=op[2](next,x,y);result=out[0];line=out[1]||'';focus=out[2]||col;}
    else if(type==='add'){const i=put(next,col,x,y);result=description.replaceAll('{x}',x).replaceAll('{y}',y);}
    else if(type==='addf'){a.unshift(x);result=description.replaceAll('{x}',x);}
    else if(type==='rem'){const isMap=['map','tmap','pq'].includes(keyTypes[col]);const i=isMap?a.findIndex(z=>z[0]===x):a.indexOf(x);if(i<0)result=`${x} was not found in ${col}.`;else{a.splice(i,1);result=description.replaceAll('{x}',x);}}
    else if(!a.length)result=`${col} is empty, so there is nothing to remove.`;
    else if(type==='peek'){const i=edge==='l'?a.length-1:0;const value=label(a[i]);result=description.replaceAll('{i}',value);}
    else {const i=edge==='l'?a.length-1:0;const item=a.splice(i,1)[0];const value=Array.isArray(item)?item[0]:item;if(type==='take')result=description.replaceAll('{i}',value);else{put(next,to,value,Array.isArray(item)?item[1]:'');focus=to;result=description.replaceAll('{i}',value);}}
    setState(next);setMessage(result);setLog(old=>[{line,result},...old].slice(0,12));
  };
  return <div className="space-y-5"><Card><SectionTitle eyebrow="System simulation" title={`Explore ${t.name}`} description="These examples combine multiple data structures. Enter sample values and run operations to watch the application state change."/><div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><input value={x} onChange={e=>setX(e.target.value)} placeholder={t.l?.[0]||'Value'} className="min-w-[140px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"/>{t.l?.[1]&&<input value={y} onChange={e=>setY(e.target.value)} placeholder={t.l[1]} className="min-w-[120px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"/>}<button onClick={reset} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold dark:border-slate-700"><RotateCcw size={13}/> Reset</button></div><div className="mb-4 flex flex-wrap gap-2">{t.ops.map((op,i)=><button key={i} onClick={()=>{const needs=op[7]||'';if(needs.includes('x')&&!x.trim()){setMessage('Enter a value first.');return;}if(needs.includes('y')&&!y.trim()){setMessage('Enter the second value first.');return;}run(op);}} className="rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-blue-700">{op[0]}</button>)}</div><div className="grid gap-3 sm:grid-cols-2">{t.cols.map(([id,title,kind])=><div key={id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold">{title}</span><span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] text-slate-500 dark:bg-slate-800">{state[id]?.length||0} items</span></div><div className="flex min-h-[54px] flex-wrap items-center gap-2">{(state[id]||[]).length?state[id].map((v,i)=><span key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">{label(v)}</span>):<span className="text-xs italic text-slate-400">Empty</span>}</div></div>)}</div><div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-500/10"><div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">System response</div><p className="text-sm leading-6 text-blue-950 dark:text-blue-100">{message}</p></div></Card><Card><SectionTitle eyebrow="Operation history" title="What just happened"/><div className="space-y-2">{log.length?log.map((entry,i)=><div key={i} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70"><p className="text-xs font-semibold">{entry.result}</p>{entry.line&&<code className="code-font mt-2 block whitespace-pre-wrap text-[10px] text-blue-600 dark:text-blue-300">{entry.line}</code>}</div>):<p className="text-xs text-slate-400">Your actions will appear here.</p>}</div></Card></div>;
}

function QuizPanel({quiz}) { const [answers,setAnswers]=useState({}); const [submitted,setSubmitted]=useState(false); const questions=Array.isArray(quiz)?quiz.slice(0,2):[]; const score=questions.filter((q,i)=>answers[i]===q[2]).length; if(!questions.length)return <Card><SectionTitle eyebrow="Knowledge check" title="Review this topic"/><p className="text-sm text-slate-500">A multiple-choice quiz is not yet available for this topic. Use the practice task instead.</p></Card>;return <div className="space-y-5"><Card><SectionTitle eyebrow="Check your understanding" title="Quick knowledge check" description="Choose one answer for each question. Submit to see your result and explanations."/><div className="space-y-6">{questions.map((q,i)=><div key={i}><div className="mb-3 flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">0{i+1}</span><p className="pt-1 text-sm font-semibold">{q[0]}</p></div><div className="grid gap-2 sm:grid-cols-3">{q[1].map((opt,j)=><button key={j} onClick={()=>{setAnswers({...answers,[i]:j});setSubmitted(false)}} className={`rounded-xl border p-3 text-left text-xs transition ${answers[i]===j?'border-blue-400 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-500/10 dark:text-blue-100':'border-slate-200 hover:border-slate-300 dark:border-slate-700'}`}>{String.fromCharCode(65+j)}. {opt}</button>)}</div>{submitted&&<p className={`mt-2 text-xs font-semibold ${answers[i]===q[2]?'text-emerald-600':'text-rose-500'}`}>{answers[i]===q[2]?'Correct!':'Not quite.'} Correct answer: {q[1][q[2]]}</p>}</div>)}</div><button onClick={()=>setSubmitted(true)} disabled={questions.some((q,i)=>answers[i]===undefined)} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Submit answers</button>{submitted&&<div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">You scored {score} out of {questions.length}. {score===questions.length?'Excellent work!':'Review the explanations and try again.'}</div>}</Card></div>; }
function PracticePanel({quiz}) { const [show,setShow]=useState(false); const challenge=Array.isArray(quiz)?quiz[2]:null; const solution=Array.isArray(quiz)?quiz[3]:null; return <div className="space-y-5"><Card><SectionTitle eyebrow="Apply what you learned" title="Coding challenge" description="Try to solve the problem yourself before opening the sample solution."/><div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-500/10"><div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-200"><Target size={15}/> Your task</div><p className="text-sm leading-7 text-amber-950 dark:text-amber-100">{challenge||'Create a small Java program that uses this concept to solve a practical problem.'}</p></div><div className="mt-5"><div className="mb-2 text-xs font-bold">Before you code, plan your solution</div><ol className="space-y-2 text-xs leading-5 text-slate-500"><li>1. Identify the input and expected output.</li><li>2. Decide which data structure or algorithm operation you need.</li><li>3. Write the steps in plain language (pseudocode).</li><li>4. Implement, test normal cases, and test an edge case.</li></ol></div><button onClick={()=>setShow(!show)} className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white dark:bg-blue-600">{show?'Hide sample solution':'Reveal sample Java solution'} <ChevronDown size={14} className={show?'rotate-180':''}/></button>{show&&<div className="mt-4 overflow-hidden rounded-xl bg-[#0b1220]"><div className="border-b border-white/10 px-4 py-3 text-xs font-semibold text-slate-300">One possible solution · Java</div><pre className="code-font overflow-x-auto p-4 text-xs leading-6 text-blue-100"><code>{solution||'// Start by choosing the appropriate data structure.\n// Implement the required operations and test edge cases.'}</code></pre></div>}</Card><Card><SectionTitle eyebrow="Learning strategy" title="How to get better at DSA"/><div className="grid gap-3 sm:grid-cols-3">{[['Understand','Explain the rule and why it exists.'],['Trace','Manually follow a small example.'],['Implement','Write the code without copying.']].map(([a,b],i)=><div key={a} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70"><div className="mb-2 text-xs font-bold text-blue-600">0{i+1} / {a}</div><p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{b}</p></div>)}</div></Card></div>; }

export default App;
