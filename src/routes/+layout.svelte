<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<header>
		<nav class="container">
			<a href="/" class="logo">Prompt<span class="highlight">AI</span></a>
			<div class="user-status">v1.1</div>
		</nav>
	</header>
	<main class="container">
		{@render children()}
	</main>
</div>

<style>
	.app-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--glass-border);
		background: rgba(15, 23, 42, 0.3);
		backdrop-filter: blur(8px);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		background: linear-gradient(to right, #fff, #94a3b8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.highlight {
		color: var(--color-primary);
		-webkit-text-fill-color: var(--color-primary);
	}

	.user-status {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		background: rgba(255, 255, 255, 0.05);
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
	}

	main {
		flex: 1;
		padding: 3rem 0;
		display: flex;
		flex-direction: column;
		align-items: center; /* Center content */
	}
</style>
