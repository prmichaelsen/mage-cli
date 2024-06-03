### Mage Terminal Chatbot

Mage is a command line interface chatbot that allows you to combine the power of your
terminal with the power of LLM AI.

Mage is a simple utility that derives its potential from the command line tool ecosystem.

#### Features

- Standard mode for quick queries
- Interactive mode for extended conversations via `--interactive`
- Output the generated prompts sent to the completion engine via `--echo`
- Execute a command and analyze its output by prefixing a message with `>`

For instance, you can run `> git diff`, `> ls`, or `> ps` during an interactive session with Mage
and ask it questions about the output.

Mage has no built in way to remember your conversations. Instead, you can leverage
standard bash shell features such as output redirection and command substitution to persist conversations
to disk or resume them later where you left off.

#### Installation

```sh
npm i -g @prmichaelsen/mage
```

#### Initial Setup

Mage is built on AWS Bedrock Claude Anthropic v2 and it requires CLI authentication with an AWS profile
authorized to call Bedrock in order to work. See the AWS docs on [CLI authentication](https://docs.aws.amazon.com/signin/latest/userguide/command-line-sign-in.html).

```sh
aws sso login --profile my-profile
```

If you aren't authenticated and authorized, Mage fails silently.

#### Usage

```sh
mage "Hello Computer"

Hello!
```

#### API

```
mage [message]

--interactive, -i     Interactive mode for extended conversations
--echo, -e            Output the generated prompts sent to the completion engine
```

#### Examples

##### Quick query

```sh
mage "What is 2 + 2?"

2 + 2 = 4
```

##### Analyze command output

Here we use an interactive mage session to analyze the output of `git diff`.

```
mage -i


Hi there, I'm happy to help if I can. What can I assist you with?

---

> git diff

---

Okay, I've made a note of the command `git diff` that you ran and the output that was returned. Let me know if you need anything else!

---

Based on the diff, what does this code do?

---

This code implements a conversational AI assistant that allows the user to have a text conversation with an AI model. The user can provide input text, which is sent to the AI model to generate a response. The conversation continues interactively, with the user and AI model taking turns to add to the conversation. The code handles prompting the user for input, calling the AI model, printing the conversation with logging, and supporting some special commands like executing shell commands and capturing the output.

---

```

##### Persist a conversation to disk

Mage does not have any built in way to persist conversations. However, you can combine Mage
with output redirection to persist conversations.

```sh
mage -ie "Hello World!" >> conversation.md
```

##### Continue a conversation from disk

Likewise, to continue a conversation, you can use command substitution.

```sh
mage -ie "$(cat conversation.md)" >> conversation.md
```

You can start any conversation using the command above the conversation file
will be created if it doesn't exist.

`-e` or `--echo` tells Mage to format its output in the expected format for a Claude
Anthropic prompt. If you plan to read from a persisted conversation, you need
to include `--echo` in order for Mage to understand the preloaded conversation.

#### Tips

Use VS Code's Markdown Previewer to render your `.md` conversations.
