# Canvas-People-Parser

This is a Node script written in Typescript I used to assign students to graders on my staff while 
serving as the lead teaching assistant for an intermediate-level computer science course at Indiana 
University. 

The use-cases of this program are as follows:

* As a instructor/co-instructor for a course using Canvas LMS, I can automatically assign to graders 
many students in a useful and equitable way. I download the HTML of Canvas's People tab for the course, 
give the tool this file, choose from some options, and receive an output file (.csv) with these grader 
assignments that I can pass on to my staff. 
* If my course has many lab/recitation/discussion sections staffed with one or many TAs each, I can 
prioritize assigning students' graders such that their grader is a TA who leads their lab section 
(where possible), allowing students to more easily get in contact with their grader. I do this as 
part of the prompted options in the script.

## Implementation and Maintenance

The core logic of the program relies some assumptions of the nature of Canvas LMS. At the time of 
development, the People tab lists students' information such as their name, optional pronouns, 
user ID, section code, and more. In particular, the following must hold:

* The name (and optional pronouns) of the student is given (possibly indirectly among other places) in the HTML format
```HTML
  <a class="roster_user_name student_context_card_trigger">John Doe <i>(he/him/his)</i>
  </a>
```
This is done using the regex
```regex
/<a [^>]*class="roster_user_name student_context_card_trigger">[\s\S]+?(?=<\/a>)<\/a>/
```

* The id of the student is given 
