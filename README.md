# morphtoken-webapp

## Setup

```sh
npm install
```

## Run

```sh
npm run dev
```

## Troubleshooting

If you're getting weird issues during `npm run dev`, try `npm run build && npm run start` to see if anything different happens. If you have updated node / npm recently, maybe you haven't reinstalled everything:

```sh
rm -rf node_modules
npm install --update-binary
```

## Redesign Code Organization

### JavaScript

#### Components 

For consistency and organization, I wanted to keep all meaningful React components and styling in the `/components` folder. Thus the `/pages` folder is treated mostly as a router. The actual layout of a page, and any components specific to that page, can be found in `/components/by-page/{page-name}`.

Any other component that is common across more than one page is in `/components/common`.

#### Misc JS 

`/state` contains code for Redux. 

`/lib` contains other modules with helper functions and utilities. The module names should be pretty self-explanatory. 

### CSS

Styles for a particular component are in the `index.css` file in that component's directory, with two exceptions: 

  - In rare cases two different components share a class with a lot of common styling. For example, the `ToCurrency` and `FromCurrency` components share the `.currency-bar` class. In such cases, the styling for that class can be found in the first shared parent of those two components. E.g., in the above case, in `/TradeWidget/index.css`. 

  - All global styles are in `/global.css`. This includes (1) utility classes, like `.hidden`, `.align-center`, or `.upper`, and also classes for tags like `input` and `a`. 

Variables are all found in `postcss.config.js`. This includes color variables and some others for things like cubic-bezier functions for transitions. A variable called "my-special-yellow" could be set as a border color with `border-color: var(--my-special-yellow)`. 


### Text 

I experimented in this project with separating all text and other media from the component tree and into json files found in the `/text` directory at the project root. The idea here is that if, for example, you decide you want to change the text displayed on a button in the trade widget at a given stage of that widget, you won't have to hunt for the component module containing that button, and then search through conditional rendering logic for the text that appears at that stage. You can just go to the json file in `/text/common`, find `trade_widget.duplicate_trade_button` and edit the corresponding value. 

Because you also want to be able to embed links and images, and to include italic text, bulleted lists, etc., I enabled Markdown editing in those json files. I'm using the [markdown-to-jsx](https://github.com/probablyup/markdown-to-jsx) library. I wrapped it's implementation in the component at `/common/EasyMarkdown` for a more declarative and flexible usage for our cases. 

This approach has it's drawbacks. We're intermingling JSON, markdown, and HTML. The trickiest thing is handling whitespace/newlines. I hadn't really landed on a satisfactory pattern for that. Generally preferred to do arrays of "lines" for multiple paragraphs rather than using `\n` characters, which kind of defeat the purpose of human legibility. 


## Redesign Misc Notes

Just a couple things that I think might not be obvious or clear at first glance:

  - The `tradeStages` object in `/lib/constants`. To make it easier to compare and track the trade stages, I gave these objects prototype methods for easy comparison/sorting. That meant though that they weren't serializable and not really suited for the Redux store. What I ended up doing was storing only the keys used to access them on the store. That might not be clear at first glance, and I was considering a light refactor to make that more straightforward later on. 

  - In general, the css for the trade widget is complex. There is a matrix of layout changes that crosses the different layouts on different pages and at different trade stages with three different responsive size breakpoints. If any further design refactors take place I recommend moving only in the direction of simplifying those layouts. In terms of the code, the only helpful note I can think of is that the `.locked` class is meant to designate that this is how the layout will change after the trade has been initiated. There are also some elements in that layout where it was actually simpler to duplicate them and show/hide the duplicates at different stages/sizes rather than attempt to move the original elements around. 


## Redesign Debt

Not all text has been extrapolated out of the component modules and into the `/text` files. I started using the markdown about halfway through the project, and so during the first half of the project, in cases where I had to use links or images, I wrote the text directly in the component module. If you like the separation of text from the component tree, I recommend finishing that refactor. 





