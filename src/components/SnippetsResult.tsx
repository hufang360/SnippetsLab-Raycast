import {
  Clipboard,
  ActionPanel,
  List,
  Action,
  closeMainWindow,
} from "@raycast/api";
import { execa } from "execa";
import { SnippetsResult } from "../types";
import { execFile } from "child_process";
import { promisify } from "util";
import { SnippetsDetail } from "./SnippetsDetail";

const execFilePromisified = promisify(execFile);

function accessories(tags: string[] | null): any {
  return tags?.map((tag) => {
    return {
      tag,
    };
  });
}

export default function ({
  result,
  index,
  snippetsApp,
}: {
  result: SnippetsResult;
  index: string;
  snippetsApp: any;
}) {
  // 提取分类
  const categoryRegex = /^(.*?)\􀈕\s(.*?)\s*􀙚\s(.*?)$/;
  const subtitle = result?.subtitle;
  const categoryMatch = subtitle ? subtitle.match(categoryRegex) : null;
  const category = categoryMatch ? categoryMatch[2].trim() : '';
  const tagRegex = /#(\S+)/g;
  const tags = subtitle ? subtitle.match(tagRegex) : null;

  if (!snippetsApp) {
    throw new Error('snippetsApp is required');
  }

  return (
    <List.Item
      key={result.uid}
      title={result.title}
      subtitle={category}
      icon="command-icon.png"
      detail={<SnippetsDetail text={result.action} />}
      actions={
        <ActionPanel>
          <Action
            title="Copy to Clipboard"
            shortcut={{ modifiers: ["cmd"], key: "c" }}
            onAction={async () => copyCallbackInBackground(index)}
          />
          <Action
            title="Paste"
            onAction={async () => pasteCallbackInBackground(snippetsApp.path, index)}
          />
          <Action
            title="Open in SnippetsLab"
            shortcut={{ modifiers: ["opt"], key: "enter" }}
            onAction={async () => openCallbackInBackground(index)}
          />
        </ActionPanel>
      }
      accessories={accessories(tags)}
    />
  );
}

async function openCallbackInBackground(snippetsIndex: string) {
  await closeMainWindow({ clearRootSearch: true });
  await execa("open", [
    "-g",
    "snippetslab://alfred/" + snippetsIndex + "/?modifier=alt",
  ]);
}

async function copyCallbackInBackground(snippetsIndex: string) {
  await closeMainWindow({ clearRootSearch: true });
  await execa("open", [
    "-g",
    "snippetslab://alfred/" + snippetsIndex + "/?modifier=cmd",
  ]);
}

async function pasteCallbackInBackground(path: string, snippetsIndex: string) {
  await closeMainWindow({ clearRootSearch: true });

  const { stdout: data } = await execFilePromisified(
    `./SnippetsLabAlfredWorkflow`,
    ["--action=fetch", `--query=${snippetsIndex}`],
    {
      cwd: `${path}/Contents/SharedSupport/Integrations`,
    }
  );

  await Clipboard.paste(data);
}
