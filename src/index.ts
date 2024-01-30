import { Context, Schema, h } from "koishi";

export const name = "metaleon-general";
export const inject = ["database"];

export interface Config {}

export const Config: Schema<Config> = Schema.object({});
const AtRegex = /<at id="(.+)" name="(.+)"\/>/;

export function apply(ctx: Context) {
  // write your plugin here
  ctx
    .command("register")
    .action(async (argv) => {
      const source = argv.source;
      const match = source.match(AtRegex);
      const session = argv.session;

      console.log(source);
      console.log(match);

      if (!match || match[1] !== session.bot.userId) return ``;

      const auth = await ctx.database.get("user", 0, ["authority"]);

      if (auth[0].authority >= 2) {
        await session.send("已经注册过了");
        return;
      }

      const result = await ctx.database.set("user", 0, { authority: 2 });

      if (result.modified === 1)
        await session.send(h("at", { name: session.username }) + "注册成功");
      else await session.send("注册失败");

      return;
    })
    .alias("注册")
    .alias("登记");
}
