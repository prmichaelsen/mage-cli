import { cli } from "../cli";
import { execSync } from "node:child_process";
import { BedrockRuntime, config } from "aws-sdk";
import * as readline from "node:readline";
import { log } from "../extern/log";

cli.command<{
  text?: string;
  interactive: boolean;
  echo: boolean;
}>(
  "$0 [text]",
  "",
  (yargs) => {
    yargs.option("interactive", {
      alias: "i",
      type: "boolean",
      default: false,
      boolean: true,
    });
    yargs.option("echo", {
      alias: "e",
      type: "boolean",
      default: false,
      boolean: true,
    });
  },
  async (argv) => {
    const { interactive, echo, text: _text = "" } = argv;
    config.update({ region: "us-east-1" });
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const defaultText = "Human:\nHello, I need some help today.";
    const conversation: string[] = [];
    let text: string;
    if (_text.trim() === "") {
      text = defaultText;
      if (echo) {
        log.printn(text);
        log.print("---");
      }
      conversation.push(text);
      conversation.push(`Assistant: `);
    } else {
      if (_text.startsWith("Human:")) {
        text = _text;
        conversation.push(text);
        const answer = await new Promise<string>((resolve) =>
          rl.question("", resolve)
        );
        const input = `Human:\n${answer}`;
        conversation.push(input);
        if (echo) {
          log.printn(input);
          log.print("---");
        }
        conversation.push(`Assistant:\n`);
      } else {
        text = `Human:\n${_text}`;
        conversation.push(text);
        conversation.push(`Assistant:\n`);
        if (echo) {
          log.print();
          log.printn(text);
          log.printn("---");
        }
      }
    }
    do {
      const params = {
        body: JSON.stringify({
          prompt: conversation.join("\n"),
          temperature: 0,
          top_p: 0,
          top_k: 0,
          max_tokens_to_sample: 1000,
          stop_sequences: ["[STOP]"],
        }),
        modelId: "anthropic.claude-v2",
        accept: "application/json",
        contentType: "application/json",
      };
      const bedrockRuntime = new BedrockRuntime({
        apiVersion: "2023-09-30",
      });
      const res = await bedrockRuntime.invokeModel(params).promise();
      const result = JSON.parse(String(res.body)) as {
        completion: string;
      };
      if (echo) {
        log.print("Assistant: ");
      } else {
        log.print();
      }
      log.print(result.completion.trim());
      if (interactive) {
        log.print();
        log.printn("---");
      }

      if (interactive) {
        const answer = await new Promise<string>((resolve) =>
          rl.question("", resolve)
        );
        if (interactive) {
          log.print();
        }
        if (answer.startsWith(">")) {
          const cmd = answer.substring(1);
          const out = execSync(cmd, { encoding: "utf-8" });
          const output = `
\`\`\`sh
// Command
${cmd}
\`\`\`

\`\`\`sh
// Output
${out}
\`\`\`
              `.trim();
          conversation.push(
            "Human:\n Make note of this command that I ran on my machine and the related output\n\n. " +
              output,
            `Assistant:\n `
          );
          if (echo) {
            log.print("Human: ");
            log.print(output);
          }
        } else {
          conversation.push(`Human: ${answer}`, `Assistant: `);
          if (echo) {
            log.print("Human: ");
            log.printn(answer);
          }
        }
        log.printn("---");
      }
    } while (interactive);
    rl.close();
  }
);
