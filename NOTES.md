# Summary

1. I decided to use Webpack to avoid browser warnings about modules. The main reason for that is that I`m using Jest for testing.

2. I realize that there is better solution for this task. Firstly more unit tests. I used Jest only with React apps for now, and that is the reason for lack of tests. I had problems with testing DOM elements, so there are no tests for filtering.

3. I tried not to interfere to index.html static structure, but implement solutions to existing elements.

4. Event listeners also can be added using document.readyState or DOMContentLoaded event to be sure the HTML document has been loaded completely.

5. App was tested on Firefox 75.0b6 and Chrome 80.0.3987.149. All functionalities, behavior, responsiveness and look same on both.

6. To start:

```bash
$ npm run build
$ npm start
```

7. To test:

```bash
$ npm run test
```
