<template>
	<div class="discord-buttons"
>
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'DiscordButtons'
};
</script>

<style>
.discord-buttons {
	display: flex;
	flex-wrap: wrap;
}
</style>