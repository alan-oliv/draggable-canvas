![draggable-canvas-logo-light](./docs/readme-light.png#gh-light-mode-only)
![draggable-canvas-logo-dark](./docs/readme-dark.png#gh-dark-mode-only)

# Draggable Canvas

You can see it running [here](https://alan-oliv.github.io/draggable-canvas/) 🚀

The Canvas API provides a means for drawing graphics via JavaScript and the HTML canvas element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.
This repo is a study on how [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element behaves working alongside [ReactJS](https://https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)

## Getting started

This is a simple [Create React App](https://create-react-app.dev/) that implements a canvas image slider, that lets you drag to change images.

To start or build the application just run the scripts found in `package.json`:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Architecture

Since the project is very simple, the architecture is very straigh-forward for now, containing just the `components` folder which is the most important one

### Compound components pattern

I wanted to introduce this pattern here to give a 'react' face to canvas element (which is standalone)
The idea is that you have two or more components that work together to accomplish a useful task. Typically one component is the parent, and the other is the child. The objective is to provide a more expressive and flexible API.

What we'll achieve here, is a better API.
Let's take the example of the `select` html component, imagine that instead of having:

```
<select>
  <option value="value1">key1</option>
  <option value="value2">key2</option>
  <option value="value3">key3</option>
</select>
```

We had:

```
<select options="key1:value1;key2:value2;key3:value3"></select>
```

**What an awful API, right?** - That's what we want to avoid with the canvas element, when implementing this pattern.

Instead of passing a prop that receives an image array (which is completely not extandable and hard to maintain) we'll pass image child nodes.

#### Components

##### DraggableCanvas

This component is the parent component that is responsible for canvas context and drawing

| Props                    | Type      | Required | Description                                           | Default |
| ------------------------ | --------- | -------- | ----------------------------------------------------- | ------- |
| `width`                  | number    | false    | specifies the width of the canvas element, in pixels  | 300     |
| `height`                 | number    | false    | specifies the height of the canvas element, in pixels | 150     |
| `children`               | ReactNode | true     | Images to be drawn in canvas element                  | null    |
| `dragSpeed`              | number    | false    | prop name speaks for itself 😄                        | 1       |
| `initialPreloadQuantity` | number    | false    | Number of images that will pre-load at the first load | 2       |
| `preloadQuantity`        | number    | false    | Number of images you want to load ahead (as you drag) | 1       |

##### DraggableCanvasImage

This is the child component, which only works inside his main parent.
It's responsibility is to calculate and do everything that relates to image and it's size and ratio

| Props | Type   | Required | Description                                     | Default |
| ----- | ------ | -------- | ----------------------------------------------- | ------- |
| `src` | string | true     | contains the path to the image you want to draw | -       |

## Deploy

This repo uses [Github Pages](https://pages.github.com/) for deploying the application.\
You can see it running [here](https://alan-oliv.github.io/draggable-canvas/). and, If you really need, these are the [builded files](https://github.com/alan-oliv/draggable-canvas/tree/gh-pages) that we use for it :)
