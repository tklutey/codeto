# CodeTo
[CodeTo](https://codeto.io/) is an adaptive platform for learning computer science.

### About the Project

CodeTo is the result of the author spending several years in K-12 CS education, teaching everything from introductory courses to [AP CS A](https://apstudents.collegeboard.org/courses/ap-computer-science-a) and [AP CS Principles](https://apcentral.collegeboard.org/courses/ap-computer-science-principles/course). During this time, the author felt the acute lack of CS education apps that provided dynamic, individualized, and adaptive learning to students. This is the gold standard of educational technology, with providers like [ALEKS Math](https://en.wikipedia.org/wiki/ALEKS) and [IXL Learning](https://www.ixl.com/company/story) serving more established K-12 subjects. With the rapid proliferation of K-12 CS initiatives across the globe, it's only a matter of time until the same paradigm is applied to computer science. This project is a proof-of-concept attempting to do so.

### Technical Details

#### Approach

The core engine of CodeTo is based on [knowledge space theory](https://en.wikipedia.org/wiki/Knowledge_space), a combinatorial modeling of a learner's progression. There are a few important principles underlying knowledge space theory:

1. The knowledge space is a collection of _skills_, the most finite unit of knowledge. Skills have two states: mastered or unmastered.
2. Skills have dependency relationships; for example, in an introductory Java course, learning polymorphism is dependent on learning how to declare a class. Because of these dependencies, the number of feasible knowledge states is significantly reduced from the number of states that are combinatorially possible.
3. CodeTo (and any other engine built on knowledge space theory) has two objectives: (1) to match the student's initial knowledge state as efficiently as possible, and (2) once the student's knowledge state is established, they should learn skills that are immediately adjacent to their current state.

The below graphic shows all of the feasible interim knowledge states that a student could pass through on their way to learning the skills _a, b, c, d, e_:

![image](https://github.com/tklutey/codeto/assets/17607557/fd982971-9938-4919-8ceb-b0a055404fa0)


#### Tech Stack

CodeTo uses React and NextJS on the front end. The API layer uses [TRPC](https://trpc.io/) for enhanced routing and type safety. For persistence, Postgresql is used. 

### Running This Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

#### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
