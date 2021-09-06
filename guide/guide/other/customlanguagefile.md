# Using a custom language file

GCommands also allows you to customize the messages it sends. [**Here's the default language file**](https://raw.githubusercontent.com/Garlic-Team/GCommands/dev/src/util/message.json)

```js
new GCommandsClient({
  /* ... */
  language: "italian", // english, spanish, portuguese, russian, german, czech, slovak, turkish, polish, indonesian, italian, french
  ownLanguageFile: require("./message.json"),
});
```

Copy the default language file, and modify it however you want.

::: tip
You can help us out by adding new languages. You can do that by going [here](https://github.com/Garlic-Team/GCommands/blob/dev/src/util/message.json), editing the file, and submitting it.
:::
