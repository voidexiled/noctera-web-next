import { Typography } from "@/components/Typography";
import TableEmptyState from "@/components/common/TableEmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import configLua from "@/hooks/useConfigLua";

const lua = configLua();

export default function Rules() {
	//readAllTables({ allSeeds: true, seedFile: true, logTables: false });
	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Rules</CardTitle>
			</CardHeader>

			<CardContent className="space-y-2">
				<div className="space-y-2">
					<p className="text-xs">
						In order to ensure that the game is enjoyable for everyone on {lua.serverName}, we
						expect all players to follow the rules. If you are caught breaking the rules, it may
						result in a temporary or permanent ban from your account. We also reserve the right to
						temporarily or permanently ban your account for any reason, however, you can reduce this
						risk to zero by following the rules. Please take a time and read the rules before
						playing.
					</p>

					<p className="text-xs">
						Every report must be made in Video: If you have reported an irregularity in Help and a
						Gamemaster is not online at the moment to check the occurrence, they must record the
						infraction and report it in one of the service channels.
					</p>
				</div>
				<div>
					<p className="mb-4 pt-4 text-xs">
						* Topics that are marked with this indicate that the rule has been updated or recently
						added.
					</p>
				</div>

				<div className="flex flex-col rounded-sm border p-2 shadow-sm ">
					<table className="w-full max-w-full table-auto text-xs">
						<thead>
							<tr>
								<th>
									<b>Category</b>
								</th>
								<th>
									<b>Rule</b>
								</th>
							</tr>
						</thead>
						<tbody className="table-row-group align-middle">
							<tr className="border-b">
								<td width={"20%"}>
									<b> 1 - Inappropriate Names</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<li>
										Use of names that are insulting, racist, sex-related, drug-related, harassing or
										generally objectionable.
									</li>
									<li>Names without any meaning. (ex.: "ahausdhaauhsd")</li>
									<li>
										Names that contain words that refer to administration (ex. "ADM", "GOD", "CM",
										"GM", "TUTOR")
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>2 - Gamemasters</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<li>
										Threatening a gamemaster because of their actions or position as a gamemaster.
									</li>
									<li>
										Pretending to be a gamemaster or have influence over a gamemaster's decisions.
									</li>
									<li>
										Intentionally providing wrong or misleading information to a gamemaster
										regarding their inquiries or making false reports about rule violations.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>
										<b>3 - Player Killing</b>
									</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									Player Killing is prohibited in the modality of{" "}
									<span className="label label-info" data-action="popover" data-placement="right">
										“TRAP RED/TRAP BLACK”
									</span>
									: “use of multiple characters stacked in one place, with the purpose of making
									another player(s) acquire red skull or black skull involuntarily.”
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b> 4 - Public Chat</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<li>
										Spamming is prohibited: “Several players sending similar phrases in a short
										period of time”.
									</li>
									<li>
										The limit of announcements that a player can send within depots, temple boats is
										15 seconds.
									</li>
									<li>
										Sharing personal information is prohibited (e.g. IP, addresses, social networks,
										etc.).
									</li>
									<li>Attempting to purchase this information is also prohibited.</li>
									<li>
										Advertising other servers in any chat, whether public or private, is prohibited.
									</li>
									<li>
										The Help chat is for restricted use for clarifying doubts. It should be used for
										any questions regarding game mechanics, quests, items, addons, mounts, account
										doubts, updates, etc. Being clear that the channel should be used for questions.
										Any player who uses help for other purposes, such as complaints, discussions,
										jokes, spam, sales, advertisements, etc., and is seen by a tutor or staff
										member, in addition to receiving a mute, will be liable to banishment from the
										account used. We have tickets and the forum for you to express your opinion,
										indignation or praise, do not use Help for this.
									</li>
									<li>
										World chat & English chat: Sale, purchase and exchange announcements are
										prohibited. Spamming is prohibited (sending the same similar message in a short
										period of time).
									</li>
									<li>
										All messages involving any type of exchange from outside {lua.serverName} to
										inside and vice versa must be made in a new channel called "World Trade". Any
										message regarding these topics that are made in any other channel, including
										Local Chat, will be punishable by banishment, both of the character used and may
										also result in banishment of all characters of the player.
									</li>
									<li>
										Announcements in chats, with the exception of the Help Channel, that involve the
										issue of casino are still allowed, but now there is a minimum time for them to
										be sent. Announcements of this type can only be sent once per minute, regardless
										of the location sent, if staff verifies spam of the same, the practice will be
										punished with banishment.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b> 5 - Blocking locations</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									The obstruction of locations is strictly prohibited, including: access to{" "}
									<b>quests</b>, <b>hunts</b> or <b>boats</b>. If the infraction is proven, all
									involved, including the main char, will be liable to banishment. Even if the main
									char is not directly involved in the action.
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>6 - Events</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<li>
										The use of{" "}
										<span className="label label-info" data-action="popover" data-placement="right">
											MULTICLIENTES
										</span>{" "}
										is prohibited within events organized by the game {lua.serverName}.
									</li>
									<li>
										The formation of teams within the{" "}
										<a href="?view=battle_royale">Battle Royale</a> event is strictly prohibited.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>7 - HACKING</b>
								</td>
								<td>
									<li>
										Any site advertised in the game will be considered a HACK LINK, except for the
										official site (www.{lua.serverName}.com) and Tibia fansites.
									</li>
									<li>
										Does not apply to youtube video links of players who produce content that does
										not harm the good reputation of the game {lua.serverName}.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b> 8A. - Multi-Client </b>
								</td>
								<td className="space-y-2 px-6 py-4">
									The Multi-Client rule determines a maximum limit of 2 characters for each player,
									who are together performing the same function in the same location and the maximum
									limit of 8 characters per player in different functions and/or locations. If more
									than 8 characters per player are detected regardless of location/function or more
									than 2 characters together in the same location/function, the same will be
									punished.
									<b>There are some particularities in the rule that will be listed below:</b>
									<li>
										Before applying the rule, a careful assessment will be made by a member of the
										staff and only after all the steps stipulated by the staff, the punishment will
										be applied if necessary.
									</li>
									<li>
										Several players can join together with their characters to perform the same
										function in the same location, however, from the moment that at least 2 players
										join together, the character limit is 1 for each player and not 2 as mentioned
										previously.
									</li>
									<li>
										<u>Example 1</u>: If 15 characters are together doing the same function in the
										same location and there are 15 players, each controlling their character, they
										are within the rule.
									</li>
									<li>
										<u>Example 2</u>: If there are 3 characters in the same location and in the same
										function and only 2 players controlling, they are violating the rule.
									</li>
									<li>
										Another particularity of the rule concerns the use of different vocations, where
										the maximum limit in the same location/function is increased from 2 to 4.
									</li>
									<li>
										Example 1: If a player is with 4 characters together in the same location and
										function and each one is of a different vocation (Knight, Druid, Sorcerer,
										Paladin), he is within the rule.
									</li>
									<li>
										Example 2: If a player is with 3 characters, and two or more of them are of the
										same vocation (1 Knight + 2 Druid), he is violating the rule.
									</li>
									The last particularity concerns the use of characters in the online trainer, where
									they are not considered in the total sum of characters per player, that is, they
									are not included in the account of the maximum limit of 8 characters per player.
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>8B. - Navigation </b>
								</td>
								<td className="space-y-2 px-6 py-4">
									The use of the{" "}
									<span className="label label-info" data-action="popover" data-placement="right">
										"navigation"
									</span>{" "}
									function of the bots used is strictly prohibited on our server, regardless of the
									number of characters or players involved. If the infraction is proven, after being
									checked by the staff, those involved will be punished.
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>9 - Purchase and Sale of virtual content</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<li>
										The purchase or sale of any virtual content originating from the game{" "}
										{lua.serverName} is considered illegal, such as coins, items, houses,
										characters, accounts, etc., using real money (R$, $) as a currency of exchange.
										The player who is caught committing such an infraction will suffer the
										punishments applicable to the case, which consists of the banishment of the
										character used for purchase, for the offer or the sale itself and ALL characters
										linked to this char.
									</li>
									<li>
										Similarly, the purchase of any virtual content with the characteristics already
										mentioned in the previous point is considered illegal.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>10 - Bug Abuse</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									For logical reasons, abusing any bug within the game {lua.serverName} is
									prohibited, regardless of the "benefit" that the player tries to obtain with such
									action.
									<li>
										{" "}
										The punishment for bug abuse will be one of the most severe in our game. In
										cases where the involvement of one or more players is proven, there will be an
										irreversible deletion of all accounts belonging to that player, even if other
										accounts have not actively participated in the infraction.
									</li>
									<li>
										Every bug case must be reported directly to the staff, preferably via ticket, so
										that it can be analyzed and, if possible, resolved. We count on the help and
										collaboration of all players to keep our game free from this inconvenience.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>11 - Personal Information</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<div>
										The player is aware that the game administration may access a user's personal
										information for the security of the game and the user himself, this information
										may be, ip, in-game conversations, transactions in game banks, store purchases,
										market purchases and any and all types of player movement that are of interest
										to the game.
									</div>
									<li>
										{" "}
										This information will never be revealed to the public, it will only be used in
										cases of necessity.
									</li>
									<li>
										{" "}
										The player is aware that no team member will ask for any type of information
										already mentioned above, as they are generated automatically only by the player
										being connected.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>12 - Casinos</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<li>
										The practice of casino within the game will be allowed, regardless of whether it
										is an online or offline casino.
									</li>
									<li>
										The practice of casino within the game's depots is strictly prohibited, the only
										exception is in the Rangiroa depot, where specifically in this city the practice
										is allowed.
									</li>
									<li>
										The player who decides to play in a casino has full responsibility for his
										actions and for the value or item used in it. The staff is not responsible,
										investigates and/or returns any item or value lost by the player in cases of
										theft. In other words, the practice of casino, both for those who create and for
										those who play, is of total and exclusive personal responsibility.
									</li>
									<li>
										Regardless of the proof obtained by the player of a possible theft that is
										posted in our service channels (FORUM and TICKET) the topic will be closed,
										without any response from the staff.
									</li>
									<li>
										The use of cast for characters that are practicing casino is prohibited.
										Regardless of whether it is by bot, by the player himself, in allowed depots or
										in houses. Cases will be subject to banishment, applied to the characters
										involved, to the player's main char and even to the owner of the house involved.
										The rule also applies to characters that are casting with the intention of
										showing another character playing casino.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>13 - Power Abuse</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<div>
										The practice of Power Abuse within the game hunts is strictly prohibited. The
										offender will be liable to receive notifications given by the Gamemasters, which
										may accumulate to the point of receiving a banishment of the character in
										question.
									</div>
									<b>Obs 1:</b> All in-game reports will be evaluated by a Gamemaster as soon as
									possible, following a careful analysis and observing the necessary parameters, the
									notifications may or may not be applied. For reports outside the game, evidence in
									video form will be accepted, where the entire screen must be captured, showing all
									the actions of the possible offender, these reports must be forwarded via forum or
									via the game's support WhatsApp.
									<b>Obs 2:</b> After 5 notifications applied, a banishment will occur on the
									offender's account.
									<b>Obs 3:</b> The criteria observed by the Gamemaster during the action of the
									possible offender will be:
									<li>
										The level of those involved in Power Abuse in relation to the level of the
										characters attacked.
									</li>
									<li>
										The hunt specifically that the players are invading to practice Power Abuse.
									</li>
									<li>
										The real intention of the player when entering a hunt and killing the players
										who were hunting previously.
									</li>
									<li>
										The frequency of previous Power Abuse activities of the character in question.
									</li>
									<li>
										The number of characters that are together at the time of the possible practice
										of Power Abuse.
									</li>
									<li>
										The action taken by the reported characters after killing players inside the
										hunt.
									</li>
									<li>
										This rule will not apply to locations that are not specifically hunts, such as
										cities, routes, etc.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b> 14 - Cast</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									The use of cast for characters that are training ml is prohibited, regardless of
									whether it is by bot, by the player himself, in depots or in houses. The player
									who violates this rule will be banned from cast for 15 days. The rule also applies
									to characters that are with cast open with the intention of showing another
									character training.
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b> 15 - Racism and Discrimination:</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<div>
										<li>
											The use of language, names, images or any behavior that promotes racism,
											discrimination or prejudice of any kind is strictly prohibited. This includes,
											but is not limited to, discrimination based on race, color, ethnicity,
											religion or national origin.
										</li>
										<li>
											Racist expressions, symbols or gestures, including "jokes" that marginalize or
											diminish a group, are not allowed.
										</li>
										<li>
											Violations of this rule will result in severe punishments, including, but not
											limited to, mutes, temporary or permanent bans, depending on the severity of
											the incident.
										</li>
									</div>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>16 - Chargeback / Dispute:</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<u>
										<b>Definition:</b>
									</u>{" "}
									A "chargeback" occurs when a player disputes a transaction through their bank or
									credit card service provider, alleging, for example, that they do not recognize
									the transaction or that they did not receive the items purchased.
									<u>
										<b>Consequences of Unjustified Chargeback:</b>
									</u>{" "}
									We understand that genuine chargeback situations may occur due to errors or bank
									fraud. However, if we identify that a player has opened a chargeback in an
									unjustified manner, that is, after having received and used the items or
									advantages acquired, we will take the following measures:
									<li>
										The account associated with the unjustified chargeback will be permanently
										banned.
									</li>
									<li>
										We reserve the right to recover any costs associated with the chargeback
										process, including administrative fees.
									</li>
									<u>
										<b>Prevention and Communication:</b>
									</u>
									<li>
										If a player believes there has been an error in the transaction or has other
										payment-related concerns, we encourage them to contact our support team before
										opening a chargeback. We are here to help and resolve any transaction-related
										issues.
									</li>
								</td>
							</tr>

							<tr className="border-b">
								<td>
									<b>17 Hate Speech:</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									<b>
										<u>Definition:</u>
									</b>{" "}
									Hate speech is defined as any communication that degrades, insults, threatens or
									harms an individual or group based on attributes such as race, religion,
									ethnicity, sexual orientation, gender, gender identity, disability or any other
									trait. This also extends to personal attacks, insults or threats directed at a
									player or their family.
									<u>
										<b>Consequences:</b>
									</u>
									<li>
										<u>First Offense:</u> The player will receive a warning and will be silenced in
										the game for a period determined by the administrative team.
									</li>
									<li>
										<u>Second Offense:</u> The player's account will be suspended for a specific
										period, which may range from a few days to weeks, depending on the severity of
										the offense.
									</li>
									<li>
										<u>Third Offense or Serious Offenses:</u> The player's account will be
										permanently banned.
									</li>
								</td>
							</tr>

							<tr className="">
								<td>
									<b>18 - Advertising:</b>
								</td>
								<td className="space-y-2 px-6 py-4">
									It is strictly prohibited to advertise or promote products, services or other
									games that are not directly related to {lua.serverName}.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
