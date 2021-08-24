# FAQ

#### Q: What is the difference between `@gcommands/voice` and `@discordjs/voice`?

A: `@gcommands/voice` is based on `@discordjs/voice` but has a few advantages. It's also simpler because of the `VoiceChannel` and `StageChannel` extensions for djs v13, and you don't need to use the `joinVoiceChannel` function for that. Straight `<Channel>.join()` returns you a `VoiceConnection` which is exted and has a `play` function in it. It is as similar as possible to the system as it was in djs v12.
