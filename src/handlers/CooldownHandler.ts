import { Collection } from 'discord.js';
import { Command } from '../lib/structures/Command';
import { Component } from '../lib/structures/Component';
import ms from 'ms';

// TODO exclude bot owners

export function CooldownHandler(
	userId: string,
	item: Command | Component,
	collection: Collection<string, Collection<string, number>>,
): number | void {
	if (!item.cooldown) return;
	if (!collection.has(item.name)) collection.set(item.name, new Collection<string, number>());

	const users = collection.get(item.name);

	if (users.has(userId) && users.get(userId) > Date.now()) {
		return ms(users.get(userId) - Date.now());
	} else {
		users.set(userId, Date.now() + ms(item.cooldown));
	}
}
