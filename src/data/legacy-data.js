// ---------- Helper: build one tracker step ----------
const S=(lines,log,items,o={})=>Object.assign({lines,log,items:items.slice()},o);

// ---------- Factory for Collections topics: each step is [line, log, items, highlight] ----------
const C=(name,simple,how,when,cx,rt,rx,rc,code,rows,type)=>({group:"Java Collections",name,simple,how,when,cx,real:{t:rt,x:rx,c:rc},code,gen:()=>rows.map(r=>S([r[0]],r[1],r[2],{hi:r[3]||[],vars:`size = ${r[2].length}`,type}))});
// ---------- Content for every topic ----------
const T={
stack:{group:"Data Structures",name:"Stack",simple:"A stack is like a pile of plates. You can only add a plate on top and take a plate from the top. The last plate you put on is the first one you take off (called LIFO: Last In, First Out).",
how:["push(x) puts a new item on top of the stack.","pop() removes and returns the top item.","peek() only looks at the top item without removing it.","Only the top is reachable, so you never touch the middle."],
when:["You need to undo things (undo button, browser Back).","You need to check matching brackets like ( ) { }.","You need to reverse something."],cx:["push O(1)","pop O(1)","peek O(1)"],
real:{t:"Real-world problem: Undo button in a text editor",x:"Every time you type a word, the editor pushes it onto a stack. When you press Undo, it pops the latest word, so the most recent change is undone first.",c:`Stack<String> history = new Stack<>();
history.push("Hello");        // user types Hello
history.push("Hello World");  // user types World
history.pop();                // Undo! removes "Hello World"
System.out.println(history.peek()); // prints Hello`},
code:["Stack<Integer> s = new Stack<>(); // empty stack","s.push(10);   // put 10 on top","s.push(20);   // put 20 on top","s.push(30);   // put 30 on top","int top = s.pop();   // remove top (30)","int next = s.peek(); // look at top (20)"],
gen(){const st=[];let s=[];const r=[S([0],"Create an empty stack. Nothing is inside yet.",[],{vars:"size = 0",type:"stack"})];
[["push",10,1],["push",20,2],["push",30,3],["pop",0,4],["peek",0,5]].forEach(([op,v,l])=>{let hi=[],msg;
if(op=="push"){s.push(v);hi=[s.length-1];msg=`push(${v}): ${v} is placed on TOP of the stack.`}
else if(op=="pop"){v=s.pop();msg=`pop(): the top item ${v} is removed. top = ${v}`}
else{hi=[s.length-1];msg=`peek(): we only LOOK at the top item (${s[s.length-1]}). Nothing is removed.`}
r.push(S([l],msg,s,{hi,vars:`size = ${s.length}`,type:"stack"}))});return r}},

queue:{group:"Data Structures",name:"Queue",simple:"A queue is like a line at a ticket counter. The first person who joins the line is the first person served. This is called FIFO: First In, First Out.",
how:["offer(x) adds an item at the back (rear).","poll() removes the item at the front.","peek() looks at the front item without removing it.","New items always join the back; served items always leave from the front."],
when:["Tasks must be handled in the order they arrive (printer jobs).","You process requests one by one (customer support tickets).","You need a fair first-come, first-served system."],cx:["offer O(1)","poll O(1)","peek O(1)"],
real:{t:"Real-world problem: Printer queue in an office",x:"Many people send documents to one printer. The printer cannot print all at once, so jobs wait in a queue and are printed in the order they were sent.",c:`Queue<String> printer = new LinkedList<>();
printer.offer("Report.pdf");   // Anna sends first
printer.offer("Photo.png");    // Ben sends second
String job = printer.poll();   // prints Report.pdf first
System.out.println(job);`},
code:["Queue<Integer> q = new LinkedList<>(); // empty queue","q.offer(10);  // join the back","q.offer(20);  // join the back","q.offer(30);  // join the back","int served = q.poll(); // front leaves (10)","int first = q.peek();  // who is next? (20)"],
gen(){let q=[];const r=[S([0],"Create an empty queue. Nobody is in line yet.",[],{vars:"size = 0",type:"queue"})];
[["offer",10,1],["offer",20,2],["offer",30,3],["poll",0,4],["peek",0,5]].forEach(([op,v,l])=>{let hi=[],msg;
if(op=="offer"){q.push(v);hi=[q.length-1];msg=`offer(${v}): ${v} joins the BACK of the line.`}
else if(op=="poll"){v=q.shift();msg=`poll(): the FRONT item ${v} is served and leaves the line.`}
else{hi=[0];msg=`peek(): the next in line is ${q[0]}. We do not remove it.`}
r.push(S([l],msg,q,{hi,vars:`size = ${q.length}`,type:"queue"}))});return r}},

cover:C("Collections Overview","The Java Collections Framework (in java.util) is a toolbox of ready-made data structures. Instead of building your own list or map, you pick the one that fits your job.",["Collection is the parent of List, Set and Queue.","Map is separate: it stores key-value pairs.","Each type has several classes (ArrayList, HashSet, HashMap...) that are good at different things."],["Ordered items, duplicates allowed: List.","Only unique items: Set.","Look up by key: Map.","Process in a certain order: Queue or Deque."],["List","Set","Map","Queue"],"Real-world problem: A school app","Student names go in a List, unique club IDs in a Set, ID-to-name lookup in a Map, and help requests in a Queue.",`List<String> names = new ArrayList<>();\nSet<Integer> clubs = new HashSet<>();\nMap<Integer, String> byId = new HashMap<>();\nQueue<String> help = new LinkedList<>();`,[`List<String> names = new ArrayList<>(); // ordered, duplicates OK`,`Set<Integer> clubs = new HashSet<>();   // unique only`,`Map<Integer, String> byId = new HashMap<>(); // key -> value`,`Queue<String> help = new LinkedList<>(); // first in, first out`],[[0,"List: keeps order and allows duplicates (Ana appears twice).",["Ana","Ben","Ana"]],[1,"Set: no duplicates allowed.",["101","102"]],[2,"Map: each key points to one value.",["101=Ana","102=Ben"]],[3,"Queue: first in, first out.",["Help1","Help2"]]],"set"),

arraylist:C("ArrayList","An ArrayList is a resizable array. It keeps items in order, each with an index starting at 0, and allows duplicates.",["add(x) puts x at the end.","get(i) reads position i instantly.","remove(i) deletes an item and shifts later items left."],["You read by index a lot.","You need a default, general-purpose list."],["get O(1)","add O(1)","insert/remove middle O(n)"],"Real-world problem: Shopping cart","Items are added in order and shown by position.",`ArrayList<String> cart = new ArrayList<>();\ncart.add("Pen");\ncart.add("Book");\ncart.remove(0); // Pen removed`,[`ArrayList<String> list = new ArrayList<>(); // empty list`,`list.add("Pen");    // goes to index 0`,`list.add("Book");   // goes to index 1`,`list.add(1, "Ink"); // insert at index 1`,`list.remove(0);     // delete Pen`],[[0,"Empty list created.",[]],[1,"add(Pen): placed at index 0.",["Pen"],[0]],[2,"add(Book): placed at index 1.",["Pen","Book"],[1]],[3,"add(1, Ink): Ink goes to index 1 and Book shifts right.",["Pen","Ink","Book"],[1]],[4,"remove(0): Pen is deleted and everything shifts left.",["Ink","Book"]]],"list"),

linkedlist:C("LinkedList","A LinkedList is a chain of nodes. Each node holds a value and links to its neighbors.",["addFirst/addLast change the ends instantly.","No shifting is needed at the ends.","get(i) must walk node by node, so it is slower."],["You often add or remove at the front or back.","You rarely need get(i)."],["addFirst O(1)","get(i) O(n)"],"Real-world problem: Music playlist","Songs can be added at the front or end, and each song links to the next one.",`LinkedList<String> songs = new LinkedList<>();\nsongs.add("B");\nsongs.addFirst("A");\nsongs.removeLast();`,[`LinkedList<String> l = new LinkedList<>(); // empty chain`,`l.add("B");      // join the end`,`l.add("C");      // join the end`,`l.addFirst("A"); // new head of the chain`,`l.removeLast();  // drop the tail (C)`],[[0,"Empty chain created.",[]],[1,"add(B): B is the only node.",["B"],[0]],[2,"add(C): C links after B.",["B","C"],[1]],[3,"addFirst(A): A becomes the new head.",["A","B","C"],[0]],[4,"removeLast(): the tail C is removed.",["A","B"]]],"list"),

hashset:C("HashSet","A HashSet stores unique items only. Adding a duplicate does nothing. The order is not guaranteed.",["add(x) stores x only if it is new.","contains(x) answers true/false very fast.","Duplicates are ignored."],["You must remove duplicates.","You need fast membership checks."],["add O(1)","contains O(1)"],"Real-world problem: Unique website visitors","Each visitor ID is added to a set, so repeat visits are not counted twice.",`HashSet<String> visitors = new HashSet<>();\nvisitors.add("u1");\nvisitors.add("u1"); // ignored\nSystem.out.println(visitors.size()); // 1`,[`HashSet<String> s = new HashSet<>(); // empty set`,`s.add("cat");`,`s.add("dog");`,`s.add("cat"); // duplicate`,`boolean has = s.contains("dog"); // true`],[[0,"Empty set created.",[]],[1,"add(cat): new, so it is stored.",["cat"],[0]],[2,"add(dog): new, so it is stored.",["cat","dog"],[1]],[3,"add(cat): already inside, so nothing changes.",["cat","dog"],[0]],[4,"contains(dog) is true.",["cat","dog"],[1]]],"set"),

linkedhashset:C("LinkedHashSet","A LinkedHashSet is a HashSet that remembers the order you added items.",["Unique items, like HashSet.","Loops give items in insertion order.","Uses a little more memory."],["You need unique items AND the original order."],["add O(1)","contains O(1)"],"Real-world problem: Recently viewed products","Each product appears once, in the order the shopper saw it.",`Set<String> viewed = new LinkedHashSet<>();\nviewed.add("Shoes");\nviewed.add("Hat");\nviewed.add("Shoes"); // ignored, order kept`,[`Set<String> s = new LinkedHashSet<>(); // empty`,`s.add("C");`,`s.add("A");`,`s.add("C"); // duplicate, ignored`],[[0,"Empty set created.",[]],[1,"add(C): stored first.",["C"],[0]],[2,"add(A): stored after C.",["C","A"],[1]],[3,"add(C) again: ignored. Order stays C, A.",["C","A"],[0]]],"set"),

treeset:C("TreeSet","A TreeSet keeps unique items automatically sorted.",["add(x) puts x in its sorted position.","first() and last() give the smallest and largest.","Items must be comparable (numbers, Strings...)."],["You need unique AND sorted items.","You need the smallest or largest quickly."],["add O(log n)","contains O(log n)"],"Real-world problem: Leaderboard of unique scores","Scores are always shown from lowest to highest with no repeats.",`TreeSet<Integer> scores = new TreeSet<>();\nscores.add(50);\nscores.add(20);\nSystem.out.println(scores.first()); // 20`,[`TreeSet<Integer> t = new TreeSet<>(); // empty`,`t.add(50);`,`t.add(20); // goes before 50`,`t.add(80);`,`int low = t.first(); // 20`],[[0,"Empty sorted set created.",[]],[1,"add(50).",[50],[0]],[2,"add(20): placed before 50 to stay sorted.",[20,50],[0]],[3,"add(80): placed at the end.",[20,50,80],[2]],[4,"first() returns the smallest: 20.",[20,50,80],[0]]],"set"),

hashmap:C("HashMap","A HashMap stores key-value pairs. You find a value by its key, like looking up a word in a dictionary.",["put(k, v) saves a pair. The same key overwrites the old value.","get(k) returns the value instantly.","Keys are unique and the order is not guaranteed."],["You look things up by key (ID to name).","You count things (word to count)."],["put O(1)","get O(1)"],"Real-world problem: Student ID lookup","Given an ID, the system finds the student name immediately without scanning a list.",`HashMap<Integer, String> students = new HashMap<>();\nstudents.put(101, "Ana");\nSystem.out.println(students.get(101)); // Ana`,[`HashMap<Integer, String> m = new HashMap<>(); // empty`,`m.put(101, "Ana");`,`m.put(102, "Ben");`,`m.put(101, "Cara"); // same key: overwrite`,`String n = m.get(102); // Ben`],[[0,"Empty map created.",[]],[1,"put(101, Ana): new pair added.",["101=Ana"],[0]],[2,"put(102, Ben): new pair added.",["101=Ana","102=Ben"],[1]],[3,"put(101, Cara): key 101 exists, so its value is replaced.",["101=Cara","102=Ben"],[0]],[4,"get(102) returns Ben.",["101=Cara","102=Ben"],[1]]],"map"),

linkedhashmap:C("LinkedHashMap","A LinkedHashMap is a HashMap that remembers the order keys were added.",["Same methods as HashMap.","Loops follow insertion order.","Can be used to build a simple cache."],["You need fast lookup AND predictable order."],["put O(1)","get O(1)"],"Real-world problem: Restaurant menu","Menu sections must appear in a fixed order (Starter, Main, Dessert) while still being looked up by name.",`Map<String, Integer> menu = new LinkedHashMap<>();\nmenu.put("Starter", 5);\nmenu.put("Main", 12);\nfor (String k : menu.keySet()) System.out.println(k);`,[`Map<String, Integer> m = new LinkedHashMap<>(); // empty`,`m.put("Starter", 5);`,`m.put("Main", 12);`,`m.put("Dessert", 6); // loops print in this order`],[[0,"Empty map created.",[]],[1,"put(Starter, 5).",["Starter=5"],[0]],[2,"put(Main, 12): placed after Starter.",["Starter=5","Main=12"],[1]],[3,"put(Dessert, 6): order stays Starter, Main, Dessert.",["Starter=5","Main=12","Dessert=6"],[2]]],"map"),

treemap:C("TreeMap","A TreeMap is a map whose keys are always kept sorted.",["put(k, v) inserts by sorted key.","firstKey() and lastKey() give the smallest and largest key.","Keys must be comparable."],["You need keys in sorted order.","You need range queries (all keys between A and M)."],["put O(log n)","get O(log n)"],"Real-world problem: Dictionary sorted A to Z","Words are stored with meanings and always listed alphabetically.",`TreeMap<String, String> dict = new TreeMap<>();\ndict.put("pear", "fruit");\ndict.put("apple", "fruit");\nSystem.out.println(dict.firstKey()); // apple`,[`TreeMap<String, Integer> m = new TreeMap<>(); // empty`,`m.put("pear", 3);`,`m.put("apple", 5); // sorted before pear`,`m.put("mango", 2); // sorted in the middle`,`String k = m.firstKey(); // apple`],[[0,"Empty sorted map created.",[]],[1,"put(pear, 3).",["pear=3"],[0]],[2,"put(apple, 5): placed before pear to stay sorted.",["apple=5","pear=3"],[0]],[3,"put(mango, 2): placed in the middle.",["apple=5","mango=2","pear=3"],[1]],[4,"firstKey() returns apple.",["apple=5","mango=2","pear=3"],[0]]],"map"),

pqueue:C("PriorityQueue","A PriorityQueue serves the most important item first, not the oldest. By default the smallest number has the highest priority.",["offer(x) adds an item.","poll() removes the highest-priority (smallest) item.","peek() looks at it without removing."],["The most urgent item must go first (emergency room).","You schedule tasks by priority."],["offer O(log n)","poll O(log n)","peek O(1)"],"Real-world problem: Hospital emergency room","Patients are treated by urgency (1 = critical), not by arrival time.",`PriorityQueue<Integer> er = new PriorityQueue<>();\ner.offer(3); // minor\ner.offer(1); // critical\nSystem.out.println(er.poll()); // 1`,[`PriorityQueue<Integer> pq = new PriorityQueue<>(); // empty`,`pq.offer(30);`,`pq.offer(10); // smaller = more important`,`pq.offer(20);`,`int next = pq.poll(); // 10 leaves first`],[[0,"Empty priority queue created.",[]],[1,"offer(30).",[30],[0]],[2,"offer(10): 10 is more important, so it moves to the front.",[10,30],[0]],[3,"offer(20): fits between 10 and 30.",[10,20,30],[1]],[4,"poll() removes 10, the smallest value.",[20,30],[0]]],"queue"),

deque:C("ArrayDeque","An ArrayDeque is a double-ended queue: you can add and remove at BOTH ends. It works as a fast stack or a fast queue.",["addFirst/addLast add at either end.","pollFirst/pollLast remove from either end.","It is faster than Stack and LinkedList for these jobs."],["You want a modern replacement for Stack.","You need both-end access, like a sliding window."],["add/poll at ends O(1)"],"Real-world problem: Browser history","New pages are added at the end, and Back removes from the end. Old history can be trimmed from the front.",`Deque<String> pages = new ArrayDeque<>();\npages.addLast("Home");\npages.addLast("News");\npages.pollLast(); // Back button`,[`Deque<String> d = new ArrayDeque<>(); // empty`,`d.addLast("B");   // add at the back`,`d.addFirst("A");  // add at the front`,`d.addLast("C");`,`d.pollFirst();    // remove from the front (A)`],[[0,"Empty deque created.",[]],[1,"addLast(B).",["B"],[0]],[2,"addFirst(A): A is placed at the front.",["A","B"],[0]],[3,"addLast(C): C is placed at the back.",["A","B","C"],[2]],[4,"pollFirst() removes A from the front.",["B","C"]]],"queue"),

utils:C("Collections Class","Collections (with an s) is a helper class with ready-made tools to sort, reverse, search and shuffle lists.",["Collections.sort(list) orders items.","Collections.reverse(list) flips the order.","max, min, shuffle, binarySearch and unmodifiableList also exist."],["You want to sort without writing loops.","You want a quick max or min."],["sort O(n log n)","max O(n)"],"Real-world problem: Ranking exam scores","Sort the scores, flip them to show the best first, and grab the top score in one line each.",`List<Integer> scores = new ArrayList<>(List.of(70, 95, 82));\nCollections.sort(scores);    // [70, 82, 95]\nCollections.reverse(scores); // [95, 82, 70]\nint best = Collections.max(scores); // 95`,[`List<Integer> n = new ArrayList<>(List.of(5, 2, 9));`,`Collections.sort(n);    // [2, 5, 9]`,`Collections.reverse(n); // [9, 5, 2]`,`int big = Collections.max(n); // 9`],[[0,"A list with 5, 2, 9 is created.",[5,2,9]],[1,"sort(n): items are now in ascending order.",[2,5,9]],[2,"reverse(n): the order is flipped.",[9,5,2],[0]],[3,"max(n) returns 9, the biggest value.",[9,5,2],[0]]],"list"),

iterator:C("Iterator","An Iterator is like a bookmark that walks through a collection one item at a time. It is the safe way to remove items while looping.",["iterator() gives you the bookmark, placed before the first item.","hasNext() asks: is there another item?","next() moves forward and returns the item.","remove() safely deletes the item you just got."],["You must delete items while looping.","You want to loop over any collection (List, Set...) the same way."],["hasNext O(1)","next O(1)"],"Real-world problem: Remove cancelled orders","While going through today's orders, the shop removes every cancelled one. Using remove() on the iterator avoids errors that a normal loop would cause.",`Iterator<String> it = orders.iterator();\nwhile (it.hasNext()) {\n    String o = it.next();\n    if (o.startsWith("X")) it.remove(); // cancelled\n}`,[`List<String> names = new ArrayList<>(List.of("Ana", "Ben", "Cara"));`,`Iterator<String> it = names.iterator(); // bookmark before first item`,`while (it.hasNext()) {   // is there another item?`,`  String n = it.next();  // move forward and return it`,`  if (n.equals("Ben")) it.remove(); // safely delete Ben`,`}`],[[0,"The list is created.",["Ana","Ben","Cara"]],[1,"The iterator starts before the first item.",["Ana","Ben","Cara"]],[2,"hasNext() is true: there is an item ahead.",["Ana","Ben","Cara"]],[3,"next() returns Ana.",["Ana","Ben","Cara"],[0]],[3,"next() returns Ben.",["Ana","Ben","Cara"],[1]],[4,"remove() safely deletes Ben, the item just returned.",["Ana","Cara"]],[3,"next() returns Cara.",["Ana","Cara"],[1]],[5,"hasNext() is false, so the loop ends.",["Ana","Cara"]]],"list"),

vector:C("Vector","A Vector is an older version of ArrayList. Its methods are synchronized (thread-safe), which makes it a bit slower.",["Works like ArrayList: add, get, remove.","Only one thread at a time can use its methods.","Grows by doubling its size when full."],["You read old code that already uses it.","In new code prefer ArrayList (or a concurrent collection for threads)."],["get O(1)","add O(1)","remove middle O(n)"],"Real-world problem: Shared scores from two threads","Two threads add scores to the same list. A Vector will not break, because each method call is locked.",`Vector<Integer> scores = new Vector<>();\nscores.add(90); // safe if two threads call at once\nscores.add(75);`,[`Vector<Integer> v = new Vector<>(); // empty, thread-safe list`,`v.add(10);  // locked while adding`,`v.add(20);`,`int x = v.get(0); // 10`,`v.remove(0);      // 10 removed, 20 shifts left`],[[0,"Empty Vector created.",[]],[1,"add(10): stored at index 0.",[10],[0]],[2,"add(20): stored at index 1.",[10,20],[1]],[3,"get(0) returns 10.",[10,20],[0]],[4,"remove(0): 10 is deleted and 20 shifts left.",[20]]],"list"),

hashtable:C("Hashtable","A Hashtable is an older, thread-safe version of HashMap. It does not allow null keys or null values.",["put(k, v) and get(k) work like HashMap.","Methods are synchronized, so it is slower.","A null key or value throws a NullPointerException."],["You read old code that uses it.","In new code use HashMap (or ConcurrentHashMap for threads)."],["put O(1)","get O(1)"],"Real-world problem: Legacy login table","An old system keeps username to password-hash in a Hashtable that several threads share.",`Hashtable<String, String> users = new Hashtable<>();\nusers.put("ana", "x9f2");\nSystem.out.println(users.get("ana"));`,[`Hashtable<Integer, String> h = new Hashtable<>(); // empty`,`h.put(1, "A");`,`h.put(2, "B");`,`String s = h.get(1); // A`,`h.put(3, null);      // ERROR: null not allowed`],[[0,"Empty Hashtable created.",[]],[1,"put(1, A): pair stored.",["1=A"],[0]],[2,"put(2, B): pair stored.",["1=A","2=B"],[1]],[3,"get(1) returns A.",["1=A","2=B"],[0]],[4,"put(3, null) throws NullPointerException. The map is unchanged.",["1=A","2=B"]]],"map"),

enums:C("EnumSet & EnumMap","EnumSet and EnumMap are super-fast collections made only for enum values (a fixed list of names like MON, TUE, WED). They always keep the enum order.",["EnumSet holds unique enum values.","EnumMap maps an enum value to something else.","Items are kept in the order the enum was declared."],["Your keys or items come from an enum.","You want speed and low memory."],["add O(1)","get O(1)"],"Real-world problem: Work days and daily plans","The days of the week are fixed, so an EnumSet stores the days you work and an EnumMap stores what you do each day.",`EnumSet<Day> work = EnumSet.of(Day.MON, Day.TUE);\nEnumMap<Day, String> plan = new EnumMap<>(Day.class);\nplan.put(Day.MON, "Gym");`,[`enum Day { MON, TUE, WED } // fixed list of values`,`EnumSet<Day> s = EnumSet.noneOf(Day.class); // empty`,`s.add(Day.WED);`,`s.add(Day.MON); // kept in enum order`,`EnumMap<Day, String> plan = new EnumMap<>(Day.class); // Day -> text`],[[0,"The enum Day has 3 fixed values: MON, TUE, WED.",["MON","TUE","WED"]],[1,"An empty EnumSet is created.",[]],[2,"add(WED).",["WED"],[0]],[3,"add(MON): MON is placed BEFORE WED because the enum order is kept.",["MON","WED"],[0]],[4,"An EnumMap is created. Its keys will also be in enum order.",["MON","WED"]]],"set"),

compare:C("Comparable vs Comparator","Both decide how objects are sorted. Comparable is the default order built into the class. Comparator is a separate rule you give when you want a different order.",["Comparable: the class has compareTo(). It gives ONE natural order.","Comparator: a separate rule with compare(a, b). You can make many.","Negative result means first goes first, 0 means equal, positive means first goes after."],["Comparable: a clear natural order (by age or ID).","Comparator: sort by name, price, etc., or when you cannot edit the class."],["sort O(n log n)"],"Real-world problem: Class list","Students are normally sorted by age (Comparable). The teacher sometimes needs them by name (Comparator) without changing the Student class.",`class Student implements Comparable<Student> {\n    int age; String name;\n    public int compareTo(Student o) { return age - o.age; }\n}\nlist.sort(Comparator.comparing(s -> s.name)); // by name`,[`class Student implements Comparable<Student> { // natural order`,`  public int compareTo(Student o) { return this.age - o.age; } // by age`,`}`,`Collections.sort(list);  // uses compareTo: youngest first`,`list.sort(Comparator.comparing(s -> s.name)); // A to Z by name`],[[0,"Students start unsorted: (name, age).",["Cara 22","Ana 25","Ben 20"]],[1,"compareTo returns a negative number when this student is younger, so younger goes first.",["Cara 22","Ana 25","Ben 20"]],[3,"Collections.sort uses compareTo, so the list is sorted by age.",["Ben 20","Cara 22","Ana 25"],[0]],[4,"The Comparator sorts by name instead, with no change to the class.",["Ana 25","Ben 20","Cara 22"],[0]]],"list"),

linear:{group:"Algorithms",name:"Linear Search",simple:"Linear search checks every item one by one, from the start, until it finds what you want. It is like looking for a name by reading a list from the top.",
how:["Start at the first item.","Compare the item with the target.","If it matches, stop and return its position.","If not, move to the next item. If you reach the end, the target is not there (return -1)."],
when:["The list is small.","The list is NOT sorted.","You only search once, so sorting first is not worth it."],cx:["Best O(1)","Worst O(n)"],inp:{arr:"7,3,9,4,1",target:"4"},
real:{t:"Real-world problem: Find a student in an unsorted attendance list",x:"A teacher has a random list of student IDs and wants to know if ID 2045 is present. The simplest way is to check each ID one by one.",c:`int[] ids = {1033, 2045, 1190, 3001};
int target = 2045;
for (int i = 0; i < ids.length; i++) {
    if (ids[i] == target) {
        System.out.println("Found at " + i);
    }
}`},
code:["int[] a = {7, 3, 9, 4, 1}; // our list","for (int i = 0; i < a.length; i++) { // go through each item","  if (a[i] == target) {   // is this the one?","    return i;             // yes! return position","  }","}","return -1;  // not found"],
gen(a,t){const r=[];let found=false;
for(let i=0;i<a.length;i++){r.push(S([0],`i = ${i}. Move to position ${i}.`,a,{hi:[i],vars:`i = ${i}, target = ${t}`,k:"visit",ptr:{i}}));
const m=a[i]==t;r.push(S([2],`Is a[${i}] (${a[i]}) equal to ${t}? ${m?"YES":"No"}.`,a,{hi:[i],vars:`i = ${i}, a[i] = ${a[i]}, target = ${t}`,k:"compare",cmp:m?"eq":"ne",ptr:{i}}));
if(m){r.push(S([3],`Found ${t} at index ${i}. return ${i}. Done!`,a,{done:[i],vars:`result = ${i}`,k:"found",ptr:{i}}));found=true;break}}
if(!found)r.push(S([6],`We checked every item. ${t} is not in the list, so return -1.`,a,{vars:"result = -1",k:"miss"}));return r}},

binary:{group:"Algorithms",name:"Binary Search",simple:"Binary search is a smart guessing game. Look at the MIDDLE item of a sorted list. If your target is smaller, throw away the right half. If bigger, throw away the left half. Repeat until found.",
how:["The list MUST be sorted.","Pick the middle item.","If it equals the target, you are done.","If the target is bigger, search the right half. If smaller, search the left half.","Each step cuts the list in half."],
when:["The list is sorted.","The list is big (thousands or millions of items).","You search many times."],cx:["Best O(1)","Worst O(log n)"],inp:{arr:"2,5,8,12,16,23,38",target:"23",sort:1},
real:{t:"Real-world problem: Looking up a name in a phone book",x:"You do not read every page. You open the middle, see if the name comes before or after, and keep halving. Even with 1,000,000 names you need only about 20 checks.",c:`int[] sorted = {2, 5, 8, 12, 16, 23, 38};
int target = 23;
int low = 0, high = sorted.length - 1;
while (low <= high) {
    int mid = (low + high) / 2;
    if (sorted[mid] == target) break; // found
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
}`},
code:["int low = 0, high = a.length - 1; // search range","while (low <= high) {   // while range is not empty","  int mid = (low + high) / 2;  // middle position","  if (a[mid] == target) return mid; // found it","  else if (a[mid] < target) low = mid + 1; // go right","  else high = mid - 1;       // go left","}","return -1;  // not found"],
gen(a,t){const r=[];let lo=0,hi=a.length-1;const R=()=>[lo,hi];
r.push(S([0],`Start with the full list. low = ${lo}, high = ${hi}.`,a,{rng:R(),vars:`low = ${lo}, high = ${hi}`,k:"init",ptr:{low:lo,high:hi}}));
while(lo<=hi){r.push(S([1],`low (${lo}) <= high (${hi}), so there is still something to search.`,a,{rng:R(),vars:`low = ${lo}, high = ${hi}`,k:"range",ptr:{low:lo,high:hi}}));
const mid=Math.floor((lo+hi)/2);r.push(S([2],`mid = (${lo} + ${hi}) / 2 = ${mid}. Look at a[${mid}] = ${a[mid]}.`,a,{rng:R(),hi:[mid],vars:`low = ${lo}, high = ${hi}, mid = ${mid}`,k:"compare",cmp:a[mid]===t?"eq":a[mid]<t?"lt":"gt",ptr:{low:lo,high:hi,mid}}));
if(a[mid]==t){r.push(S([3],`a[${mid}] = ${a[mid]} equals ${t}. Found at index ${mid}!`,a,{done:[mid],vars:`result = ${mid}`,k:"found",ptr:{low:lo,high:hi,mid}}));return r}
if(a[mid]<t){lo=mid+1;r.push(S([4],`${a[mid]} < ${t}, so the target is on the RIGHT. low = ${lo}.`,a,{rng:R(),hi:[mid],vars:`low = ${lo}, high = ${hi}`,k:"narrow",cmp:"lt",ptr:{low:lo,high:hi,mid}}))}
else{hi=mid-1;r.push(S([5],`${a[mid]} > ${t}, so the target is on the LEFT. high = ${hi}.`,a,{rng:R(),hi:[mid],vars:`low = ${lo}, high = ${hi}`,k:"narrow",cmp:"gt",ptr:{low:lo,high:hi,mid}}))}}
r.push(S([7],`low is bigger than high, so the range is empty. ${t} is not here. return -1.`,a,{rng:[1,0],vars:"result = -1",k:"miss"}));return r}},

bubble:{group:"Algorithms",name:"Bubble Sort",simple:"Bubble sort compares two neighbors at a time and swaps them if they are in the wrong order. The biggest values slowly “bubble” to the end, like bubbles rising in water.",
how:["Compare the first two neighbors.","If the left one is bigger, swap them.","Move one step right and repeat until the end of the list.","After each full pass, the biggest unsorted value is in its final place.","Repeat passes until everything is sorted."],
when:["You are learning how sorting works.","The list is very small.","Simplicity matters more than speed. For big data, use faster sorts."],cx:["Best O(n)","Worst O(n²)"],inp:{arr:"5,3,8,1,4"},
real:{t:"Real-world problem: Ranking exam scores from lowest to highest",x:"A teacher has a short list of scores and wants them in order. Bubble sort swaps neighbors until the whole list is sorted.",c:`int[] scores = {78, 92, 65, 88};
for (int i = 0; i < scores.length - 1; i++) {
    for (int j = 0; j < scores.length - 1 - i; j++) {
        if (scores[j] > scores[j + 1]) {
            int t = scores[j];
            scores[j] = scores[j + 1];
            scores[j + 1] = t;
        }
    }
}`},
code:["int[] a = {5, 3, 8, 1, 4}; // unsorted list","for (int i = 0; i < a.length - 1; i++) { // each pass","  for (int j = 0; j < a.length - 1 - i; j++) { // neighbors","    if (a[j] > a[j + 1]) { // wrong order?","      int t = a[j];     // keep left value","      a[j] = a[j + 1];  // move right value left","      a[j + 1] = t;     // put left value right","    }","  }","}"],
gen(a){a=a.slice();const r=[];const n=a.length;const done=[];
r.push(S([0],"Start with the unsorted list.",a,{vars:"i = -, j = -",k:"start"}));
for(let i=0;i<n-1;i++){for(let j=0;j<n-1-i;j++){const v=`i = ${i}, j = ${j}`;
r.push(S([2,3],`Compare a[${j}] (${a[j]}) and a[${j+1}] (${a[j+1]}). Is ${a[j]} > ${a[j+1]}? ${a[j]>a[j+1]?"YES, swap them":"No, leave them"}.`,a,{hi:[j,j+1],done:done.slice(),vars:v,k:"compare",cmp:a[j]>a[j+1]?"gt":"lt",ptr:{i,j}}));
if(a[j]>a[j+1]){const x=a[j];a[j]=a[j+1];a[j+1]=x;r.push(S([4,5,6],`Swapped! The list is now [${a.join(", ")}].`,a,{hi:[j,j+1],done:done.slice(),vars:v,k:"swap",ptr:{i,j}}))}}
done.push(n-1-i);r.push(S([8],`Pass ${i+1} finished. ${a[n-1-i]} is now in its final place.`,a,{done:done.slice(),vars:`i = ${i}`,k:"pass",ptr:{i}}))}
done.push(0);r.push(S([9],`All passes are done. Sorted list: [${a.join(", ")}].`,a,{done:a.map((_,k)=>k),vars:"sorted = true",k:"done"}));return r}}
};

// ---------- Added beginner sorting algorithms ----------
Object.assign(T, {
insertion: {
  group:"Algorithms", name:"Insertion Sort",
  simple:"Insertion Sort builds a sorted section one element at a time. It takes the next value (the key), shifts larger values one position to the right, then inserts the key into the gap.",
  how:[
    "Treat the first element as a sorted section containing one value.",
    "Take the next element as the key. This is the value we want to insert.",
    "Compare the key with values to its left, moving from right to left.",
    "While a value is larger than the key, shift that value one position to the right.",
    "Place the key in the empty position, then repeat with the next element."
  ],
  when:["The data set is small or nearly sorted.","New values arrive over time and need to be inserted into an already sorted list.","You want a simple, stable sorting algorithm that uses constant extra space."],
  cx:["Best O(n)","Average O(n²)","Worst O(n²)","Space O(1)"],
  inp:{arr:"7,3,8,2,6"},
  real:{t:"Real-world problem: Keep a small class score list sorted",x:"A teacher enters quiz scores one at a time and wants the scores to remain in ascending order. Insertion Sort places each new score into the correct position among the scores already processed.",c:"int[] scores = {7, 3, 8, 2, 6};\nfor (int i = 1; i < scores.length; i++) {\n    int key = scores[i];\n    int j = i - 1;\n    while (j >= 0 && scores[j] > key) {\n        scores[j + 1] = scores[j];\n        j--;\n    }\n    scores[j + 1] = key;\n}"},
  code:["int[] a = {7, 3, 8, 2, 6}; // values to sort","for (int i = 1; i < a.length; i++) { // sorted prefix starts at index 0","  int key = a[i]; // value we want to insert","  int j = i - 1; // begin at the right edge of sorted prefix","  while (j >= 0 && a[j] > key) { // larger value belongs after key","    a[j + 1] = a[j]; // shift larger value one position right","    j--; // compare the next value to the left","  }","  a[j + 1] = key; // place key into the gap","}"],
  gen(a){
    a=a.slice(); const r=[]; const n=a.length;
    r.push(S([0],"Start: only the first element is considered sorted. The remaining elements are waiting to be inserted.",a,{done:[0],vars:"i = 1",k:"start",ptr:{i:0}}));
    for(let i=1;i<n;i++){
      const key=a[i]; let j=i-1;
      r.push(S([1,2],`Choose key = ${key} at index ${i}. The sorted prefix is [${a.slice(0,i).join(", ")}].`,a,{hi:[i],done:Array.from({length:i},(_,k)=>k),vars:`i = ${i}, key = ${key}, j = ${j}`,k:"key",ptr:{i,key,j}}));
      while(j>=0){
        r.push(S([3],`Compare a[${j}] = ${a[j]} with key ${key}. ${a[j]>key?`${a[j]} is larger, so it must shift right.`:`${a[j]} is not larger, so shifting stops.`}`,a,{hi:[j,i],done:Array.from({length:i},(_,k)=>k),vars:`i = ${i}, key = ${key}, j = ${j}`,k:"compare",cmp:a[j]>key?"gt":"lt",ptr:{i,key,j}}));
        if(a[j]>key){a[j+1]=a[j];r.push(S([4,5],`Shift ${a[j]} one position right into index ${j+1}.`,a,{hi:[j+1],done:Array.from({length:i},(_,k)=>k),vars:`key = ${key}, j = ${j-1}`,k:"shift",ptr:{i,key,j:j-1}}));j--;}else break;
      }
      a[j+1]=key;
      r.push(S([8],`Insert key ${key} at index ${j+1}. The sorted prefix is now [${a.slice(0,i+1).join(", ")}].`,a,{hi:[j+1],done:Array.from({length:i+1},(_,k)=>k),vars:`i = ${i}, key = ${key}, inserted at ${j+1}`,k:"insert",ptr:{i,key,j:j+1}}));
    }
    r.push(S([9],`Finished! The array is sorted: [${a.join(", ")}].`,a,{done:a.map((_,i)=>i),vars:"sorted = true",k:"done"}));
    return r;
  }
},
selection: {
  group:"Algorithms", name:"Selection Sort",
  simple:"Selection Sort repeatedly finds the smallest value in the unsorted section and swaps it into the first unsorted position. The sorted section grows from left to right.",
  how:[
    "Start at the first index. This is the first position to fill.",
    "Assume the first unsorted value is the minimum.",
    "Scan the rest of the unsorted section and remember the index of the smallest value.",
    "After the scan, swap the smallest value with the first unsorted value.",
    "Move the boundary one position right and repeat until the array is sorted."
  ],
  when:["You are learning how comparison-based sorting works.","The list is small and you want to limit the number of swaps.","You need an in-place algorithm and do not require stability."],
  cx:["Best O(n²)","Average O(n²)","Worst O(n²)","Space O(1)"],
  inp:{arr:"6,3,8,2,7,1"},
  real:{t:"Real-world problem: Arrange a short list of student scores",x:"A teacher has a small group of scores and wants to arrange them from lowest to highest. Selection Sort scans the remaining scores to find the lowest one, then places it in the next position.",c:"int[] scores = {6, 3, 8, 2, 7, 1};\nfor (int i = 0; i < scores.length - 1; i++) {\n    int minIndex = i;\n    for (int j = i + 1; j < scores.length; j++) {\n        if (scores[j] < scores[minIndex]) minIndex = j;\n    }\n    int temp = scores[i];\n    scores[i] = scores[minIndex];\n    scores[minIndex] = temp;\n}"},
  code:["int[] a = {6, 3, 8, 2, 7, 1}; // values to sort","for (int i = 0; i < a.length - 1; i++) { // first unsorted position","  int minIndex = i; // assume current value is smallest","  for (int j = i + 1; j < a.length; j++) { // scan remaining values","    if (a[j] < a[minIndex]) { // found a smaller value?","      minIndex = j; // remember its index","    }","  }","  int temp = a[i]; // save current first unsorted value","  a[i] = a[minIndex]; // move minimum into its final position","  a[minIndex] = temp; // put saved value where minimum was","}"],
  gen(a){
    a=a.slice(); const r=[]; const n=a.length;
    r.push(S([0],"Start: the entire array is unsorted. The algorithm will place one minimum value at a time.",a,{vars:"i = 0",k:"start",ptr:{i:0}}));
    for(let i=0;i<n-1;i++){
      let minIndex=i;
      r.push(S([1,2],`Begin pass ${i+1}. Assume a[${i}] = ${a[i]} is the minimum.`,a,{hi:[i],done:Array.from({length:i},(_,k)=>k),vars:`i = ${i}, minIndex = ${minIndex}`,k:"pass",ptr:{i,minIndex}}));
      for(let j=i+1;j<n;j++){
        const smaller=a[j]<a[minIndex];
        r.push(S([3,4,5],`Compare a[${j}] = ${a[j]} with current minimum a[${minIndex}] = ${a[minIndex]}. ${smaller?`${a[j]} is smaller, so update minIndex to ${j}.`:`${a[j]} is not smaller; keep minIndex = ${minIndex}.`}`,a,{hi:[j,minIndex],done:Array.from({length:i},(_,k)=>k),vars:`i = ${i}, j = ${j}, minIndex = ${minIndex}`,k:"compare",cmp:smaller?"lt":"gt",ptr:{i,j,minIndex}}));
        if(smaller) minIndex=j;
      }
      if(minIndex!==i){
        const temp=a[i];a[i]=a[minIndex];a[minIndex]=temp;
        r.push(S([8,9,10],`Swap a[${i}] and a[${minIndex}]. The minimum ${a[i]} is now fixed at index ${i}.`,a,{hi:[i,minIndex],done:Array.from({length:i+1},(_,k)=>k),vars:`i = ${i}, minIndex = ${minIndex}`,k:"swap",ptr:{i,minIndex}}));
      } else {
        r.push(S([8,9,10],`The minimum is already at index ${i}; no swap is needed. This position is now fixed.`,a,{hi:[i],done:Array.from({length:i+1},(_,k)=>k),vars:`i = ${i}, minIndex = ${minIndex}`,k:"keep",ptr:{i,minIndex}}));
      }
    }
    r.push(S([11],`Finished! The array is sorted: [${a.join(", ")}].`,a,{done:a.map((_,i)=>i),vars:"sorted = true",k:"done"}));
    return r;
  }
}
});

// ---------- Quiz + practice data: [question, options, answerIndex] x2, challenge, solution ----------
const QZ={
stack:[["Which item does pop() remove from a stack?",["The bottom item","The top item","The middle item"],1],["What does LIFO mean?",["Last In, First Out","Last In, Fast Out","Low In, First Out"],0],"Reverse the word JAVA using a Stack<Character>.",`Stack<Character> s = new Stack<>();
for (char c : "JAVA".toCharArray()) s.push(c); // push every letter
String out = "";
while (!s.isEmpty()) out += s.pop(); // pop gives reverse order
System.out.println(out); // AVAJ`],
queue:[["Which item does poll() remove?",["The front item","The back item","A random item"],0],["Queue order is called...",["LIFO","FIFO","FILO"],1],"Add 3 customers to a queue, then serve the first one.",`Queue<String> q = new LinkedList<>();
q.offer("Ana"); q.offer("Ben"); q.offer("Cara"); // join the line
System.out.println(q.poll()); // Ana is served first`],
cover:[["Which one stores key-value pairs?",["List","Set","Map"],2],["Which one rejects duplicates?",["Set","List","Queue"],0],"Pick the best collection to store each student ID with a name and look it up fast.",`Map<Integer, String> names = new HashMap<>(); // ID is the key, name is the value
names.put(101, "Ana");
System.out.println(names.get(101)); // Ana`],
arraylist:[["What index does the first item have?",["1","0","-1"],1],["What is slow in an ArrayList?",["get(i)","Inserting in the middle","add at the end"],1],"Add 3 numbers and print their sum.",`ArrayList<Integer> n = new ArrayList<>();
n.add(4); n.add(6); n.add(10);
int sum = 0;
for (int x : n) sum += x; // add each item
System.out.println(sum); // 20`],
linkedlist:[["What is fast in a LinkedList?",["get(i)","addFirst(x)","Sorting"],1],["Each node links to...",["Its neighbors","Only the index","Nothing"],0],"Add B, then put A at the front.",`LinkedList<String> l = new LinkedList<>();
l.add("B");
l.addFirst("A"); // A is the new head
System.out.println(l); // [A, B]`],
hashset:[["Adding a duplicate to a HashSet...",["Throws an error","Does nothing","Stores it twice"],1],["Is the order of a HashSet guaranteed?",["Yes","No","Only for numbers"],1],"Remove duplicates from {1, 2, 2, 3}.",`int[] a = {1, 2, 2, 3};
Set<Integer> s = new HashSet<>();
for (int x : a) s.add(x); // duplicates are ignored
System.out.println(s.size()); // 3`],
linkedhashset:[["LinkedHashSet keeps...",["Insertion order","Sorted order","Random order"],0],["Does it allow duplicates?",["Yes","No","Only strings"],1],"Keep the order of first visits: A, B, A, C.",`Set<String> s = new LinkedHashSet<>();
for (String p : new String[]{"A", "B", "A", "C"}) s.add(p);
System.out.println(s); // [A, B, C]`],
treeset:[["TreeSet keeps items...",["Sorted","In insertion order","Random"],0],["What does first() return?",["The smallest","The largest","The newest"],0],"Print the largest of {5, 9, 2}.",`TreeSet<Integer> t = new TreeSet<>(List.of(5, 9, 2));
System.out.println(t.last()); // 9 is the largest`],
hashmap:[["What happens if you put the same key twice?",["Error","Value is replaced","Both stay"],1],["get() on a missing key returns...",["0","null","An error"],1],"Count how many times each word appears in {a, b, a}.",`Map<String, Integer> c = new HashMap<>();
for (String w : new String[]{"a", "b", "a"})
    c.put(w, c.getOrDefault(w, 0) + 1); // add 1 each time
System.out.println(c); // {a=2, b=1}`],
linkedhashmap:[["LinkedHashMap loops in...",["Insertion order","Sorted order","Random order"],0],["It has the same methods as...",["HashMap","Stack","Vector"],0],"Store 3 menu prices and print the names in the added order.",`Map<String, Integer> m = new LinkedHashMap<>();
m.put("Starter", 5); m.put("Main", 12); m.put("Dessert", 6);
for (String k : m.keySet()) System.out.println(k); // Starter, Main, Dessert`],
treemap:[["TreeMap sorts by...",["Value","Key","Insertion"],1],["What does firstKey() return?",["Smallest key","Largest key","First added"],0],"Put 3 words and print the alphabetically first one.",`TreeMap<String, Integer> m = new TreeMap<>();
m.put("pear", 1); m.put("apple", 2); m.put("mango", 3);
System.out.println(m.firstKey()); // apple`],
pqueue:[["poll() returns...",["The oldest item","The smallest item (default)","The largest item"],1],["PriorityQueue is best for...",["Urgent-first jobs","Alphabet lookup","Removing duplicates"],0],"Offer 5, 1, 3 and print them in priority order.",`PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(1); pq.offer(3);
while (!pq.isEmpty()) System.out.println(pq.poll()); // 1, 3, 5`],
deque:[["ArrayDeque can add at...",["Only the back","Only the front","Both ends"],2],["It is a modern replacement for...",["Stack","Map","TreeSet"],0],"Use a deque as a stack: push 1, push 2, then pop.",`Deque<Integer> d = new ArrayDeque<>();
d.push(1); d.push(2); // push adds at the front
System.out.println(d.pop()); // 2`],
utils:[["Which sorts a list?",["Collections.sort(list)","list.order()","Collections.up(list)"],0],["Collections.max(list) returns...",["The biggest item","The smallest item","The item count"],0],"Sort {3, 1, 2} from biggest to smallest.",`List<Integer> n = new ArrayList<>(List.of(3, 1, 2));
Collections.sort(n);    // [1, 2, 3]
Collections.reverse(n); // [3, 2, 1]
System.out.println(n);`],
iterator:[["Which method asks if there is another item?",["next()","hasNext()","remove()"],1],["Which deletes safely while looping?",["list.remove(x)","it.remove()","list.clear()"],1],"Remove all even numbers from {1, 2, 3, 4}.",`List<Integer> n = new ArrayList<>(List.of(1, 2, 3, 4));
Iterator<Integer> it = n.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove(); // remove evens
}
System.out.println(n); // [1, 3]`],
vector:[["Vector methods are...",["Synchronized","Static","Private"],0],["For new code you should prefer...",["ArrayList","Vector","Both are equal"],0],"Add 2 items to a Vector and print its size.",`Vector<String> v = new Vector<>();
v.add("A"); v.add("B");
System.out.println(v.size()); // 2`],
hashtable:[["Does Hashtable allow null keys?",["Yes","No","Only one"],1],["It is an older version of...",["HashMap","TreeMap","ArrayList"],0],"Store 2 users in a Hashtable and read one.",`Hashtable<String, Integer> h = new Hashtable<>();
h.put("ana", 1); h.put("ben", 2);
System.out.println(h.get("ben")); // 2`],
enums:[["EnumSet is for...",["Enum values only","Any String","Any number"],0],["Items are kept in...",["Enum order","Insertion order","Random order"],0],"Make an EnumSet of the weekend days.",`enum Day { MON, TUE, SAT, SUN }
EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);
System.out.println(weekend); // [SAT, SUN]`],
compare:[["Comparable's method is...",["compareTo","compare","sortBy"],0],["Which gives many different sort orders?",["Comparator","Comparable","Both give only one"],0],"Sort names by length using a Comparator.",`List<String> n = new ArrayList<>(List.of("Cara", "Al", "Ben"));
n.sort(Comparator.comparing(String::length)); // shortest first
System.out.println(n); // [Al, Ben, Cara]`],
linear:[["Does linear search need a sorted list?",["Yes","No","Only for numbers"],1],["Worst case speed is...",["O(1)","O(log n)","O(n)"],2],"Count how many times 4 appears in {4, 1, 4, 2}.",`int[] a = {4, 1, 4, 2};
int count = 0;
for (int x : a) if (x == 4) count++; // check every item
System.out.println(count); // 2`],
binary:[["Binary search needs a...",["Sorted list","Linked list","Set"],0],["Each step...",["Halves the range","Adds one","Doubles the range"],0],"Find 7 in {1, 3, 5, 7, 9} using Arrays.binarySearch.",`int[] a = {1, 3, 5, 7, 9};
int i = Arrays.binarySearch(a, 7); // the array must be sorted
System.out.println(i); // index 3`],
bubble:[["Bubble sort swaps...",["Neighbors","Random items","First and last"],0],["After pass 1, the biggest value is...",["At the end","At the start","Unchanged"],0],"Sort {3, 2, 1} with bubble sort.",`int[] a = {3, 2, 1};
for (int i = 0; i < a.length - 1; i++)
  for (int j = 0; j < a.length - 1 - i; j++)
    if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; } // swap
System.out.println(Arrays.toString(a)); // [1, 2, 3]`]
  ,insertion:[["What does the key represent in Insertion Sort?",["The value currently being inserted into the sorted prefix","The first value in the array forever","The largest value"],0],["What happens when a value is larger than the key?",["It is deleted","It shifts one position to the right","It moves to the end immediately"],1],"Use Insertion Sort to sort {5, 2, 4} in ascending order.",`int[] a = {5, 2, 4};
for (int i = 1; i < a.length; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
    }
    a[j + 1] = key;
}
System.out.println(Arrays.toString(a)); // [2, 4, 5]`],
  selection:[["What does Selection Sort search for during each pass?",["The largest value in the whole array","The smallest value in the unsorted section","The middle value"],1],["How many swaps does standard Selection Sort perform at most?",["n - 1","n²","2n"],0],"Use Selection Sort to sort {4, 1, 3} in ascending order.",`int[] a = {4, 1, 3};
for (int i = 0; i < a.length - 1; i++) {
    int minIndex = i;
    for (int j = i + 1; j < a.length; j++) {
        if (a[j] < a[minIndex]) minIndex = j;
    }
    int temp = a[i];
    a[i] = a[minIndex];
    a[minIndex] = temp;
}
System.out.println(Arrays.toString(a)); // [1, 3, 4]`]
};

function quiz(){const d=QZ[cur];$("pane").innerHTML=`<div class="card"><h3 class="s">Quick quiz: ${T[cur].name}</h3>`+d.slice(0,2).map((q,i)=>`<p><b>${i+1}. ${q[0]}</b></p><div class="qo" data-q="${i}">${q[1].map((o,j)=>`<button data-j="${j}">${o}</button>`).join("")}</div><div class="fb" id="fb${i}"></div>`).join("")+`<div class="now" id="qs">Score: 0 / 2</div></div>`;
let sc=0;const dn={};$("pane").onclick=e=>{const b=e.target.closest(".qo button");if(!b)return;const i=+b.parentNode.dataset.q;if(dn[i])return;dn[i]=1;const j=+b.dataset.j,r=d[i][2];if(j==r)sc++;b.parentNode.children[r].classList.add("right");if(j!=r)b.classList.add("wrong");$("fb"+i).textContent=j==r?"✓ Correct!":"✗ Not quite. The right answer is highlighted in green.";$("qs").textContent=`Score: ${sc} / 2`}}

function prac(){const d=QZ[cur];$("pane").innerHTML=`<div class="card"><h3 class="s">Practice challenge</h3><p>${d[2]}</p><textarea id="pa" rows="6" placeholder="Try writing your Java code here first..." style="width:100%;font:13px Consolas,monospace;padding:10px;border:1px solid var(--bd);border-radius:8px;background:var(--card);color:var(--ink)"></textarea><div class="ctl"><button id="sh">Show solution</button></div><div id="so"></div></div>`;$("sh").onclick=()=>{$("so").innerHTML=`<pre>${esc(d[3])}</pre><div class="tip">Compare it with your code. Different code that gives the same result is also correct.</div>`;$("sh").disabled=true}}
// ---------- ADVANCED: whole systems built from several collections ----------
const PAIR={map:1,tmap:1,pq:1};
const fm=(t,x,y,i)=>t.replace(/\{x\}/g,x).replace(/\{y\}/g,y).replace(/\{i\}/g,i);
const lab=v=>Array.isArray(v)?v[0]+'='+v[1]:String(v);
function adv(){const t=T[cur],K={};let S={};t.cols.forEach(c=>K[c[0]]=c[2]);
const reset=()=>{S={_n:1};t.cols.forEach(c=>S[c[0]]=JSON.parse(JSON.stringify(t.init[c[0]]||[])))};reset();let n=0;
$('pane').innerHTML=`<div class="card"><h3 class="s">Interactive tracker: ${t.name}</h3><p style="margin:0 0 8px;color:var(--mut)">Each click runs one Java statement. Watch several collections change together. Some starting data is already loaded.</p><div class="inp"><input id="sx" placeholder="${t.l[0]}">${t.l[1]?`<input id="sy" placeholder="${t.l[1]}">`:''}</div><div class="ctl" id="sb">${t.ops.map((o,i)=>`<button data-i="${i}">${o[0]}</button>`).join('')}<button class="g" data-i="c">Reset</button></div><div id="av"></div><div class="now" id="sn">Pick an operation above.</div><div class="log" id="sl"></div></div>${t.code?`<div class="card"><h3 class="s">Java code for this topic</h3><div class="code">${t.code.map((l,i)=>`<div class="ln"><b>${i+1}</b>${esc(l)}</div>`).join('')}</div></div>`:''}`;
const draw=(hc,hi=[])=>{$('av').innerHTML=t.cols.map(([id,ti,k])=>{const a=S[id],m=a.length;return `<div class="pn"><h4>${ti}</h4><div class="viz${k=='stack'?' stack':''}">${m?a.map((v,i)=>`<div class="cell${id==hc&&hi.includes(i)?' hi':''}"><div class="box">${esc(Array.isArray(v)?v[0]+(k=='pq'?' (p'+v[1]+')':'='+v[1]):String(v))}</div><small>${k=='stack'?(i==m-1?'top':''):(k=='queue'||k=='pq')?[i==0?'front':'',i==m-1?'rear':''].filter(Boolean).join('/'):''}</small></div>`).join(''):'<span style="color:var(--mut)">(empty)</span>'}</div></div>`}).join('')};
const put=(cc,v,w)=>{const b=S[cc],kk=K[cc];if(PAIR[kk]){const i=b.findIndex(z=>z[0]===v),val=w===''?1:w;if(i>=0)b[i][1]=val;else b.push([v,val]);if(kk=='tmap')b.sort((p,q)=>cmp(p[0],q[0]));if(kk=='pq')b.sort((p,q)=>p[1]-q[1]);return b.findIndex(z=>z[0]===v)}if(kk=='set'&&b.includes(v))return b.indexOf(v);b.push(v);return b.length-1};
const run=(o,x,y)=>{const [,ty,c,to,j,m,en]=o,a=S[c],pr=PAIR[K[c]],J=fm(j,x,y,'');
if(ty=='add'){const h=put(c,x,y);return[fm(m,x,y,''),J,c,[h]]}
if(ty=='addf'){a.unshift(x);return[fm(m,x,y,''),J,c,[0]]}
if(ty=='rem'){const i=pr?a.findIndex(z=>z[0]===x):a.indexOf(x);if(i<0)return[x+' was not found.',J,c];a.splice(i,1);return[fm(m,x,y,''),J,c]}
if(!a.length)return['It is empty, so there is nothing to take.',J,c];
const i=(ty=='move'?en:to)=='l'?a.length-1:0;
if(ty=='peek')return[fm(m,'','',lab(a[i])),J,c,[i]];
const it=a.splice(i,1)[0],nm=Array.isArray(it)?it[0]:it;
if(ty=='take')return[fm(m,'','',nm),J,c];
const h=put(to,nm,Array.isArray(it)?it[1]:'');return[fm(m,'','',nm),J,to,[h]]};
draw();
$('sb').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.i=='c'){reset();n=0;$('sl').innerHTML='';$('sn').textContent='Reset to the starting data.';draw();return}
const o=t.ops[b.dataset.i],rx=$('sx').value.trim(),ry=$('sy')?$('sy').value.trim():'',nd=o[7]||'';
if((nd.includes('x')&&!rx)||(nd.includes('y')&&!ry)){$('sn').textContent='Fill in the input box(es) this operation needs.';return}
const x=P(rx),y=P(ry),r=o[1]=='f'?o[2](S,x,y):run(o,x,y);n++;$('sn').textContent=r[0];draw(r[2],r[3]);
$('sl').insertAdjacentHTML('beforeend',`<div>Step ${n} · ${esc(r[1])} → ${esc(r[0])}</div>`);$('sl').scrollTop=$('sl').scrollHeight}}

// POS custom operations
const posAdd=(S,x,y)=>{const p=S.catalog.find(e=>e[0]===x);if(!p)return[x+' is not in the catalog. Add the product first.',`catalog.get("${x}");`,'catalog'];const q=y===''?1:+y,st=S.stock.find(e=>e[0]===x),have=st?st[1]:0;if(q>have)return['Only '+have+' of '+x+' left in stock, so it cannot be added.',`stock.get("${x}");`,'stock'];const c=S.cart.find(e=>e[0]===x);if(c)c[1]+=q;else S.cart.push([x,q]);S.undo.push(x+':'+q);return[q+' x '+x+' added to the cart (price '+p[1]+' each). The action is pushed onto the undo stack.',`cart.merge("${x}", ${q}, Integer::sum); undo.push("${x}:${q}");`,'cart',[S.cart.findIndex(e=>e[0]===x)]]};
const posUndo=S=>{const u=S.undo.pop();if(!u)return['Nothing to undo.','undo.pop();','undo'];const [nm,q]=u.split(':'),i=S.cart.findIndex(e=>e[0]===nm);if(i>=0){S.cart[i][1]-=+q;if(S.cart[i][1]<=0)S.cart.splice(i,1)}return['Undo: pop() gives '+u+', so '+q+' x '+nm+' is taken out of the cart.','String last = undo.pop(); // then reverse that action','undo']};
const posPay=S=>{if(!S.cart.length)return['The cart is empty.','cart.isEmpty();','cart'];let sub=0;S.cart.forEach(([nm,q])=>{sub+=S.catalog.find(e=>e[0]===nm)[1]*q;S.stock.find(e=>e[0]===nm)[1]-=q;const sl=S.sales.find(e=>e[0]===nm);if(sl)sl[1]+=q;else S.sales.push([nm,q])});S.sales.sort((a,b)=>cmp(a[0],b[0]));const d=sub>=100?sub*.1:0,tot=+((sub-d)*1.12).toFixed(2),id='#'+S._n++,low=S.stock.filter(e=>e[1]<=2).map(e=>e[0]);S.orders.push(id+' ('+tot+')');S.cart=[];S.undo=[];return['Receipt '+id+': subtotal '+sub+', discount '+d.toFixed(2)+' (10% off at 100 or more), tax 12%, TOTAL '+tot+'. The order joins the queue, stock goes down and the sales report updates.'+(low.length?' LOW STOCK: '+low.join(', ')+'.':''),'double total = (sub - discount) * 1.12; orders.offer(id); stock.merge(item, -qty, Integer::sum);','orders',[S.orders.length-1]]};
// Browser custom operations
const bVisit=(S,x)=>{S.back.push(S.current[0]);S.current=[x];S.forward=[];return['Visit '+x+': the old page goes onto Back and Forward is cleared.',`back.push(current); current = "${x}"; forward.clear();`,'current',[0]]};
const bBack=S=>{if(!S.back.length)return['Back is empty: nowhere to go back to.','back.isEmpty();','back'];S.forward.push(S.current[0]);S.current=[S.back.pop()];return['Back: the page you left goes onto Forward, and '+S.current[0]+' is popped from Back.','forward.push(current); current = back.pop();','current',[0]]};
const bFwd=S=>{if(!S.forward.length)return['Forward is empty.','forward.isEmpty();','forward'];S.back.push(S.current[0]);S.current=[S.forward.pop()];return['Forward: current goes onto Back and '+S.current[0]+' is popped from Forward.','back.push(current); current = forward.pop();','current',[0]]};

const AS=(name,simple,how,when,cx,rt,rx,rc,cols,l,init,ops,qz)=>({group:'Advanced Systems',adv:1,name,simple,how,when,cx,real:{t:rt,x:rx,c:rc},cols,l,init,ops,qz});
const ADV={
pos:AS('POS System (Point of Sale)','A POS system is the cash register of a store. It combines several collections: a HashMap for fast product lookup, a LinkedHashMap for the cart, a Stack for undo, a Queue for orders and a TreeMap for the sales report.',['Catalog and stock are HashMaps, so finding a product by name is instant.','The cart keeps items in the order they were added, and every cart action is pushed on an undo Stack.','Checkout adds the discount and tax, puts the order in a Queue, lowers stock (low-stock alert) and updates the TreeMap report.'],['Many different jobs must work together, each with the best-fit collection.','Shops, cafes and ordering apps.'],['lookup O(1)','undo O(1)','report O(log n)'],'Real-world problem: A small grocery store','The cashier scans items, the customer changes their mind, and the store must keep stock, receipts and daily sales correct.',`Map<String, Double> catalog = new HashMap<>();    // product -> price
Map<String, Integer> cart = new LinkedHashMap<>(); // product -> qty
Deque<String> undo = new ArrayDeque<>();           // undo stack
Queue<String> orders = new LinkedList<>();         // pending orders
TreeMap<String, Integer> sales = new TreeMap<>();  // sorted report`,[['catalog','Catalog (HashMap)','map'],['stock','Stock / inventory (HashMap)','map'],['cart','Cart (LinkedHashMap)','map'],['undo','Undo (Stack)','stack'],['orders','Orders (Queue)','queue'],['sales','Sales report (TreeMap)','tmap']],['Product','Price / Qty'],{catalog:[['Milk',50],['Bread',30],['Egg',10]],stock:[['Milk',5],['Bread',3],['Egg',20]]},[['Add product','add','catalog','',`catalog.put("{x}", {y});`,'{x} is saved in the catalog with price {y}.','','xy'],['Set stock','add','stock','',`stock.put("{x}", {y});`,'Stock of {x} is now {y}.','','xy'],['Add to cart','f',posAdd,'','','','','x'],['Undo','f',posUndo],['Checkout','f',posPay],['Serve order','take','orders','f','orders.poll();','Order {i} is served (first in, first out).']],[['Which collection is best for the undo button?',['Stack','TreeMap','HashSet'],0],['Why is a Queue used for orders?',['The first order is served first','It sorts by price','It removes duplicates'],0],'Apply a 10% discount when the subtotal is 100 or more, then add 12% tax.',`double discount = subtotal >= 100 ? subtotal * 0.10 : 0; // 10% off big carts\ndouble total = (subtotal - discount) * 1.12;              // then add 12% tax\nSystem.out.println(total);`]),
lib:AS('Library System','A library tracks books, who borrowed them and who is waiting. A HashMap finds a book by title and a Queue keeps the waiting list fair.',['Books and loans are HashMaps keyed by title.','If a book is out, the next reader joins a Queue.','When it comes back, the first person in the queue is served.'],['You need fast lookup by ID plus a fair waiting line.','Rentals, ticket booking, class enrollment.'],['lookup O(1)','poll O(1)'],'Real-world problem: School library','Students borrow popular books. If none is left they wait in line.',`Map<String, Integer> books = new HashMap<>();\nMap<String, String> loans = new HashMap<>();\nQueue<String> waitlist = new LinkedList<>();\nif (loans.containsKey(title)) waitlist.offer(student);`,[['books','Books (HashMap)','map'],['loans','Loans (HashMap)','map'],['waitlist','Waitlist (Queue)','queue']],['Book title','Copies / borrower'],{books:[['Java Basics',2],['Data Structures',1]]},[['Add book','add','books','',`books.put("{x}", {y});`,'{x} is saved with {y} copies.','','xy'],['Borrow','add','loans','',`loans.put("{x}", "{y}");`,'{y} borrows {x}.','','xy'],['Return','rem','loans','',`loans.remove("{x}");`,'{x} is returned.','','x'],['Join waitlist','add','waitlist','',`waitlist.offer("{x}");`,'{x} joins the BACK of the waiting line.','','x'],['Serve waitlist','take','waitlist','f','waitlist.poll();','{i} is first in line and gets the book next.']],[['Which structure gives a fair waiting list?',['Queue','Stack','TreeSet'],0],['Finding a book by title is fastest with...',['HashMap','ArrayList scan','Stack'],0],'Return a book and give it to the next student in the waitlist.',`loans.remove(title);           // book is back\nString next = waitlist.poll(); // first student in line\nif (next != null) loans.put(title, next); // they borrow it`]),
park:AS('Parking Lot','A parking lot knows which car is in which slot (HashMap) and makes extra cars wait in order (Queue).',['parked maps a plate number to a slot number.','If the lot is full, cars join a Queue.','When a car leaves, the next waiting car can enter.'],['You find items by ID and also handle a waiting line.','Garages, clinics, restaurants.'],['park O(1)','leave O(1)'],'Real-world problem: Mall parking','Cars enter and leave all day. When the lot is full, drivers wait in order.',`Map<String, Integer> parked = new HashMap<>(); // plate -> slot\nQueue<String> waiting = new LinkedList<>();\nparked.put("ABC123", 7);\nparked.remove("ABC123"); // car leaves\nString next = waiting.poll();`,[['parked','Parked cars (HashMap)','map'],['waiting','Waiting line (Queue)','queue']],['Plate number','Slot number'],{parked:[['ABC123',1]]},[['Park car','add','parked','',`parked.put("{x}", {y});`,'{x} is parked in slot {y}.','','xy'],['Car leaves','rem','parked','',`parked.remove("{x}");`,'{x} leaves and the slot is free.','','x'],['Join waiting line','add','waiting','',`waiting.offer("{x}");`,'{x} waits at the BACK of the line.','','x'],['Next waiting car','take','waiting','f','waiting.poll();','{i} is first in line and can enter.']],[['Which finds a car by plate fastest?',['HashMap','Queue','Stack'],0],['Waiting cars enter...',['In arrival order','Newest first','Alphabetically'],0],'Check whether plate XYZ is parked and print its slot.',`if (parked.containsKey("XYZ")) {\n    System.out.println(parked.get("XYZ")); // print the slot\n}`]),
er:AS('Hospital Emergency Room','An emergency room treats the most urgent patient first, not the one who arrived first. A PriorityQueue does that automatically.',['Each patient has a priority number (1 is most urgent).','offer() adds a patient and poll() returns the most urgent one.','Treated patients are saved in an ArrayList.'],['Urgent work must jump the line.','Task schedulers, emergency dispatch.'],['offer O(log n)','poll O(log n)'],'Real-world problem: Emergency room','A chest-pain patient who arrives later must be seen before a patient with a small cough.',`PriorityQueue<Patient> er = new PriorityQueue<>(\n    Comparator.comparingInt(p -> p.priority)); // 1 = urgent\ner.offer(new Patient("Cough", 3));\ner.offer(new Patient("Chest pain", 1));\nPatient next = er.poll(); // Chest pain`,[['waiting','Waiting room (PriorityQueue)','pq'],['treated','Treated (ArrayList)','list']],['Patient','Priority (1 = urgent)'],{waiting:[['Broken arm',2],['Cough',3]]},[['Patient arrives','add','waiting','',`er.offer(new Patient("{x}", {y}));`,'{x} is added with priority {y} and placed by urgency.','','xy'],['Who is next?','peek','waiting','f','er.peek();','Next to be treated: {i}.'],['Treat next','move','waiting','treated','treated.add(er.poll().name);','{i} is treated and moved to the treated list.','f']],[['PriorityQueue poll() returns...',['The most urgent item','The newest item','The oldest item'],0],['Which is best for urgent-first work?',['PriorityQueue','Stack','HashSet'],0],'Treat the next patient and store the name in a list.',`Patient p = er.poll(); // most urgent first\ntreated.add(p.name);   // save in the treated list`]),
browser:AS('Browser History','A browser Back and Forward button uses two stacks. Visiting a page pushes the old page onto Back, and pressing Back moves pages between the two stacks.',['Back is a Stack of pages you came from.','Forward is a Stack of pages you left using Back.','Visiting a new page clears Forward.'],['You need to go backward step by step.','Undo and redo in any editor.'],['push O(1)','pop O(1)'],'Real-world problem: Browser history','You open Home, News, Sports, then press Back twice. You return to Home and Forward remembers the rest.',`Deque<String> back = new ArrayDeque<>();\nDeque<String> forward = new ArrayDeque<>();\nback.push(current);   // visit: remember the old page\ncurrent = back.pop(); // back: return to it`,[['back','Back (Stack)','stack'],['current','Current page','list'],['forward','Forward (Stack)','stack']],['Page name',''],{current:['Home']},[['Visit page','f',bVisit,'','','','','x'],['Back','f',bBack],['Forward','f',bFwd]],[['Back and Forward are built with...',['Two stacks','Two sets','One map'],0],['Visiting a new page...',['Clears Forward','Clears Back','Sorts Back'],0],'Write the Back button code.',`if (!back.isEmpty()) {\n    forward.push(current); // save where we were\n    current = back.pop();  // go to the last page\n}`]),
playlist:AS('Music Playlist','A playlist is an ordered list of songs. A LinkedList adds songs at the front or back, a Stack remembers recent songs and a HashSet keeps unique favorites.',['LinkedList: addFirst and addLast are instant.','Stack: the last played song is on top.','HashSet: a favorite is stored only once.'],['Items change at both ends often.','You need history and no-duplicate lists.'],['addFirst O(1)','favorite O(1)'],'Real-world problem: Music app','Users add songs, play the next one and favorite songs without repeats.',`LinkedList<String> playlist = new LinkedList<>();\nplaylist.addFirst("Song A"); // play this next\nString now = playlist.poll();\nSet<String> favorites = new HashSet<>();`,[['playlist','Playlist (LinkedList)','list'],['played','Recently played (Stack)','stack'],['favorites','Favorites (HashSet)','set']],['Song name',''],{playlist:['Song A','Song B','Song C']},[['Add song','add','playlist','',`playlist.addLast("{x}");`,'{x} is added at the END.','','x'],['Add to front','addf','playlist','',`playlist.addFirst("{x}");`,'{x} is added at the FRONT and plays next.','','x'],['Play next','move','playlist','played','played.push(playlist.poll());','{i} is played and goes on top of the recent stack.','f'],['Favorite','add','favorites','',`favorites.add("{x}");`,'{x} is a favorite (a repeat would be ignored).','','x'],['Remove song','rem','playlist','',`playlist.remove("{x}");`,'{x} is removed.','','x']],[['Which stores unique favorites?',['HashSet','Stack','Queue'],0],['addFirst is fast in...',['LinkedList','HashSet','TreeMap'],0],'Play the next song and remember it as recently played.',`String song = playlist.poll(); // take the next song\nrecent.push(song);             // top of the stack = last played`]),
bank:AS('Bank Counter','A bank branch keeps accounts in a HashMap, customers wait in a Queue and every served customer is saved in an ArrayList log.',['accounts maps a name to a balance.','Customers are served first come, first served.','The log keeps every event in order.'],['Fast lookup plus fair service plus a history.','Banks, clinics, call centers.'],['lookup O(1)','serve O(1)'],'Real-world problem: Bank counter','Customers line up, the teller serves them in order and each service is recorded.',`Map<String, Integer> accounts = new HashMap<>();\nQueue<String> line = new LinkedList<>();\nList<String> log = new ArrayList<>();\nlog.add(line.poll()); // serve next customer and record it`,[['accounts','Accounts (HashMap)','map'],['line','Customer line (Queue)','queue'],['log','Service log (ArrayList)','list']],['Name / note','Balance'],{accounts:[['Ana',500],['Ben',200]]},[['Open account','add','accounts','',`accounts.put("{x}", {y});`,'Account {x} has balance {y}.','','xy'],['Join line','add','line','',`line.offer("{x}");`,'{x} joins the BACK of the line.','','x'],['Serve next customer','move','line','log','log.add(line.poll());','{i} is served and saved in the log.','f'],['Record note','add','log','',`log.add("{x}");`,'Saved in the log: {x}.','','x']],[['Customers should be served using...',['A Queue','A Stack','A TreeSet'],0],['The log keeps events in...',['The order added','Random order','Sorted by name'],0],'Serve the next customer and print who was served.',`String next = line.poll();\nSystem.out.println("Serving " + next);`]),
grades:AS('Class Grade Book','A grade book needs names in alphabetical order. A TreeMap keeps keys sorted by itself and a HashSet marks the honor roll without duplicates.',['TreeMap: name to score, always sorted by name.','HashSet: each honor student appears only once.','firstKey() gives the first name alphabetically.'],['You need data sorted by key.','Leaderboards, dictionaries, schedules.'],['put O(log n)','get O(log n)'],'Real-world problem: Class grade book','The teacher adds scores in any order and always prints names from A to Z.',`TreeMap<String, Integer> scores = new TreeMap<>();\nscores.put("Cara", 88);\nscores.put("Ana", 95);\nSystem.out.println(scores.firstKey()); // Ana`,[['scores','Scores (TreeMap)','tmap'],['honor','Honor roll (HashSet)','set']],['Student','Score'],{scores:[['Ana',95],['Cara',88]]},[['Add score','add','scores','',`scores.put("{x}", {y});`,'{x} has score {y}. Names stay sorted A to Z.','','xy'],['Remove student','rem','scores','',`scores.remove("{x}");`,'{x} is removed.','','x'],['First name A-Z','peek','scores','f','scores.firstEntry();','The first student alphabetically is {i}.'],['Honor roll','add','honor','',`honor.add("{x}");`,'{x} is on the honor roll (a repeat is ignored).','','x']],[['TreeMap keeps keys...',['Sorted','Random','In insertion order'],0],['Honor roll uses a Set so...',['There are no duplicates','Order is kept','It is sorted'],0],'Print all students with a score of 90 or more.',`for (Map.Entry<String, Integer> e : scores.entrySet()) {\n    if (e.getValue() >= 90) System.out.println(e.getKey()); // honor student\n}`]),
contacts:AS('Phone Contacts','A contact book is sorted by name (TreeMap), has a unique favorites list (HashSet) and remembers recent calls like a stack.',['TreeMap keeps contacts from A to Z.','HashSet keeps favorites without repeats.','Stack: the most recent call is on top.'],['Sorted data with quick lookup.','Phone books and dictionaries.'],['add O(log n)','search O(log n)'],'Real-world problem: Phone contacts','You add contacts in any order but the app always shows them alphabetically.',`TreeMap<String, String> contacts = new TreeMap<>();\ncontacts.put("Ben", "0917...");\nSet<String> favorites = new HashSet<>();\nDeque<String> recent = new ArrayDeque<>();`,[['contacts','Contacts (TreeMap)','tmap'],['favorites','Favorites (HashSet)','set'],['recent','Recent calls (Stack)','stack']],['Name','Phone'],{contacts:[['Ben','0917']]},[['Add contact','add','contacts','',`contacts.put("{x}", "{y}");`,'{x} is saved and the list stays A to Z.','','xy'],['Delete contact','rem','contacts','',`contacts.remove("{x}");`,'{x} is deleted.','','x'],['Favorite','add','favorites','',`favorites.add("{x}");`,'{x} is a favorite (a repeat is ignored).','','x'],['Called recently','add','recent','',`recent.push("{x}");`,'{x} goes on TOP of the recent calls.','','x'],['Remove last call','take','recent','l','recent.pop();','{i} is removed from the top.']],[['Contacts shown A to Z use a...',['TreeMap','HashSet','Queue'],0],['The last called person is on top of a...',['Stack','Queue','Set'],0],'Print the phone number of Ben, or Not found.',`String phone = contacts.get("Ben");\nSystem.out.println(phone != null ? phone : "Not found");`]),
tasks:AS('Task Manager','A task manager does the most important task first (PriorityQueue), saves finished tasks (ArrayList) and keeps a trash Stack so the last deleted task can be restored.',['PriorityQueue: priority 1 comes out first.','ArrayList: finished tasks in order.','Stack: the trash restores the last deleted task first.'],['Work must be ordered by importance.','Schedulers and job systems.'],['add O(log n)','next O(log n)'],'Real-world problem: To-do app','Users add tasks with priorities, finish urgent ones first and restore a task deleted by mistake.',`PriorityQueue<Task> tasks = new PriorityQueue<>(\n    Comparator.comparingInt(t -> t.priority));\nDeque<Task> trash = new ArrayDeque<>();\ntrash.push(tasks.poll()); // delete next\ntasks.offer(trash.pop()); // restore it`,[['tasks','Tasks (PriorityQueue)','pq'],['done','Done (ArrayList)','list'],['trash','Trash (Stack)','stack']],['Task','Priority (1 = urgent)'],{tasks:[['Homework',2],['Laundry',3]]},[['Add task','add','tasks','',`tasks.offer(new Task("{x}", {y}));`,'{x} is added with priority {y}.','','xy'],['Do next task','move','tasks','done','done.add(tasks.poll().name);','{i} is finished and moved to Done.','f'],['Trash next task','move','tasks','trash','trash.push(tasks.poll());','{i} is moved to the trash stack.','f'],['Restore last trashed','move','trash','tasks','tasks.offer(trash.pop());','{i} is restored (priority 1 in this demo).','l'],['Peek next','peek','tasks','f','tasks.peek();','Next task: {i}.']],[['Restoring the last deleted task uses a...',['Stack','Set','TreeMap'],0],['Most important task first uses...',['PriorityQueue','Queue','HashMap'],0],'Finish the next task and add it to the done list.',`Task t = tasks.poll(); // highest priority\ndone.add(t.name);      // save in the done list`])
};
Object.keys(ADV).forEach(k=>{T[k]=ADV[k];QZ[k]=ADV[k].qz});

// ---- Button trackers for the remaining collection topics ----
const DAYS=['MON','TUE','WED','THU','FRI','SAT','SUN'],byDay=(a,b)=>DAYS.indexOf(a)-DAYS.indexOf(b);
const badDay=x=>[x+' is not an enum value. Use MON, TUE, WED, THU, FRI, SAT or SUN.','Day.valueOf(name); // fails: not an enum value'];
const enumAdd=(S,x)=>{x=String(x).toUpperCase();if(!DAYS.includes(x))return[...badDay(x),'days'];if(!S.days.includes(x))S.days.push(x);S.days.sort(byDay);return[x+' is stored. EnumSet keeps enum order (MON first, SUN last) whatever order you add them.',`days.add(Day.${x});`,'days',[S.days.indexOf(x)]]};
const enumPlan=(S,x,y)=>{x=String(x).toUpperCase();if(!DAYS.includes(x))return[...badDay(x),'plan'];const i=S.plan.findIndex(e=>e[0]===x);if(i>=0)S.plan[i][1]=y;else S.plan.push([x,y]);S.plan.sort((a,b)=>byDay(a[0],b[0]));return[x+' gets the plan '+y+'. EnumMap also keeps its keys in enum order.',`plan.put(Day.${x}, "${y}");`,'plan',[S.plan.findIndex(e=>e[0]===x)]]};
const itNext=S=>{const p=S._p||0;if(p>=S.list.length)return['hasNext() is false: no more items, so next() would throw NoSuchElementException.','it.hasNext(); // false','list'];S._p=p+1;S._last=p;return['hasNext() is true. next() returns '+S.list[p]+' and the bookmark moves forward.','String s = it.next();','list',[p]]};
const itRem=S=>{if(S._last==null)return['Call next() first. remove() deletes the item that next() just returned.','it.remove(); // IllegalStateException','list'];const v=S.list.splice(S._last,1)[0];S._p=S._last;S._last=null;return[v+' is safely removed while looping. The bookmark stays in place.','it.remove();','list']};
const itNew=S=>{S._p=0;S._last=null;return['A new iterator is created: the bookmark is back before the first item.','it = list.iterator();','list']};
const cmpAge=S=>{S.students.sort((a,b)=>a[1]-b[1]);return['Comparable (compareTo) sorts by age: the youngest goes first.','Collections.sort(students); // uses compareTo (age)','students']};
const cmpName=S=>{S.students.sort((a,b)=>cmp(a[0],b[0]));return['A Comparator sorts by name instead, without changing the Student class.','students.sort(Comparator.comparing(s -> s.name));','students']};
Object.assign(T.cover,{adv:1,l:['Value','Value (Map only)'],cols:[['list','List (ArrayList)','list'],['set','Set (HashSet)','set'],['map','Map (HashMap)','map'],['queue','Queue (LinkedList)','queue']],init:{list:['Ana','Ben'],set:['Ana'],map:[[101,'Ana']],queue:['Help1']},ops:[['Add to List','add','list','',`list.add("{x}");`,'{x} is added. A List keeps order and allows duplicates.','','x'],['Add to Set','add','set','',`set.add("{x}");`,'{x} is stored. A Set ignores a repeat.','','x'],['Put in Map','add','map','',`map.put({x}, "{y}");`,'Key {x} now points to {y}. The same key overwrites.','','xy'],['Offer to Queue','add','queue','',`queue.offer("{x}");`,'{x} joins the BACK of the queue.','','x'],['Poll Queue','take','queue','f','queue.poll();','{i} is served first (FIFO).']]});
Object.assign(T.enums,{adv:1,l:['Day (MON to SUN)','Plan'],cols:[['days','EnumSet (enum order)','set'],['plan','EnumMap (enum order)','map']],init:{days:['MON','WED'],plan:[['MON','Gym']]},ops:[['Add day','f',enumAdd,'','','','','x'],['Plan a day','f',enumPlan,'','','','','xy']]});
Object.assign(T.iterator,{adv:1,l:['(no input needed)',''],cols:[['list','List (ArrayList)','list']],init:{list:['Ana','Ben','Cara','Dan']},ops:[['next()','f',itNext],['remove()','f',itRem],['New iterator','f',itNew]]});
Object.assign(T.compare,{adv:1,l:['Name','Age'],cols:[['students','Students (name=age)','map']],init:{students:[['Cara',22],['Ana',25],['Ben',20]]},ops:[['Add student','add','students','',`students.add(new Student("{x}", {y}));`,'{x} ({y}) is added.','','xy'],['Sort by age (Comparable)','f',cmpAge],['Sort by name (Comparator)','f',cmpName]]});

const cmp = (a,b) => typeof a === "number" && typeof b === "number" ? a-b : String(a).localeCompare(String(b));
window.DSA_GUIDE = { topics: T, quizzes: QZ };
