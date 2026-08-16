# Frontend Mentor - Rock, Paper, Scissors solution

This is a solution to the [Rock, Paper, Scissors challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rock-paper-scissors-game-pTgwgvgH). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the game depending on their device's screen size
- Play Rock, Paper, Scissors against the computer
- Maintain the state of the score after refreshing the browser _(optional)_
- **Bonus**: Play Rock, Paper, Scissors, Lizard, Spock against the computer _(optional)_

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [anthony-mwangi-rps.netlify.app](https://anthony-mwangi-rps.netlify.app/)

## My process

### Built with

- [react](https://reactjs.org/) - JS library
- [vite](https://vite.dev/) - Blazing fast frontend build tool
- [sass/scss](https://sass-lang.com/) - CSS with superpowers
- Semantic HTML5 markup
- CSS custom properties

### What I learned

Working on this project was a solid refresher on a few fronts. I got reacquainted with just how much SCSS has evolved since I last leaned on it heavily, and I was reminded how useful the modulus operator can be — a small but powerful tool that comes up more often than you'd expect in DSA-style problems.

Since this was my first vibe-coded app, I also came away with new ways of working with AI tools, particularly around how to structure prompts and when to trust versus double-check their output. Beyond the tooling, building the prediction model itself was probably the most fun part of the project — it gave me some genuine insight into how gaming platforms model and predict player behavior.

### Continued development

I'd like to build a dynamic version of the game that allows users to play 1-v-1, and to specify their own custom options (complete with colors, icons, ordering and rules)

### Useful resources

- [Cycle Through an Array of Values with the Modulus Operator](https://vanslaars.io/articles/cycle-through-an-array-of-values-with-the-modulus-operator/) - A blog post by **Andy Van Slaars** that provides an easy and useful insight on modular arithmentic specific to javascript arrays which is pivotal in evaluating the outcome of a rock-paper-scissors game.
- [Statistical Modeling, Causal Inference, and Social Science](https://statmodeling.stat.columbia.edu/2007/05/21/how_to_win_at_r/) - This helped me in building the advanced model for the computer to use when playing against a user instead of just relying on a randomly generated value.

### AI Collaboration

Using the `AGENTS.md` prompt as a baseline, I used both **ChatGPT** and **Claude** for debugging and, more importantly, to brainstorm ideas for the prediction algorithm.

I had a lot of success with ChatGPT on the final version of the prediction model — it was blazing fast and surfaced more relevant options. Its answers generally felt more useful than Claude's, which seemed to struggle with maintaining context and overall accuracy.

Regardless of the AI tool used, though, it was important to audit everything and do a sanity check on the final solution.

## Author

- Website - [Anthony Mwangi](https://anthonymwangi.co.ke/)
- Frontend Mentor - [@AnthonyMwangi](https://www.frontendmentor.io/profile/AnthonyMwangi)

## Acknowledgments

Special thanks to my wife, whose contributions to this rock-paper-scissors algorithm went well beyond moral support. She patiently worked through every "wait, what if they tie," and endured at least one whiteboard session that definitely did not need to happen over dinner. This project could not have been out-thought, out-paper-scissored, or out-debugged without her.

This one's for her. Rock solid, as always.
