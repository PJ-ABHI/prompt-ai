<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    let { form } = $props<{ form: ActionData }>();

    let loading = $state(false);
    let currentMode = $state("correct");

    const options = [
        { value: "correct", label: "Correct Grammar", icon: "✨" },
        { value: "email", label: "Generate Email", icon: "📧" },
        { value: "description", label: "Write Description", icon: "📝" },
        { value: "content", label: "Page Content", icon: "📄" },
        { value: "conversation", label: "English Coach", icon: "🗣️" },
    ];
</script>

<svelte:head>
    <title>PromptAI - Smart Text Assistant</title>
</svelte:head>

<div class="hero">
    <h1>Create & Refine <span class="text-gradient">Content</span></h1>
    <p class="subtitle">Enter a prompt and let our AI handle the rest.</p>
</div>

<div class="glass-panel editor-card">
    <form
        method="POST"
        use:enhance={() => {
            loading = true;
            return async ({ update }) => {
                await update();
                loading = false;
            };
        }}
    >
        <div class="toolbar">
            {#each options as option}
                <label
                    class="mode-option"
                    class:active={currentMode === option.value}
                >
                    <input
                        type="radio"
                        name="mode"
                        value={option.value}
                        bind:group={currentMode}
                    />
                    <span class="icon">{option.icon}</span>
                    <span class="label">{option.label}</span>
                </label>
            {/each}
        </div>

        <div class="input-area">
            <textarea
                name="prompt"
                placeholder="Enter your text or prompt here..."
                rows="8"
                class="input-field"
                required
            ></textarea>
        </div>

        <div class="actions">
            <button type="submit" class="btn-primary" disabled={loading}>
                {#if loading}
                    <span class="spinner"></span> Generating...
                {:else}
                    Generate Result
                {/if}
            </button>
        </div>
    </form>
</div>

{#if form?.result}
    <div class="result-section glass-panel">
        <div class="result-header">
            <h3>Result</h3>
            <span class="tag">{form.mode}</span>
        </div>
        <div class="result-content">
            <pre>{form.result}</pre>
        </div>
    </div>
{/if}

<style>
    .hero {
        text-align: center;
        margin-bottom: 3rem;
    }

    h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .text-gradient {
        background: linear-gradient(135deg, #a78bfa, #2563eb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        color: var(--color-text-muted);
        font-size: 1.25rem;
    }

    .editor-card {
        width: 100%;
        max-width: 800px;
        margin-bottom: 2rem;
        overflow: hidden;
    }

    .toolbar {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid var(--glass-border);
        overflow-x: auto;
    }

    .mode-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        color: var(--color-text-muted);
        white-space: nowrap;
    }

    .mode-option:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text-main);
    }

    .mode-option.active {
        background: rgba(99, 102, 241, 0.2);
        border-color: rgba(99, 102, 241, 0.4);
        color: #fff;
    }

    .mode-option input {
        display: none;
    }

    .input-area {
        padding: 1.5rem;
    }

    textarea {
        background: transparent;
        border: none;
        resize: vertical;
        font-size: 1.1rem;
        color: #fff;
    }

    textarea:focus {
        box-shadow: none;
        outline: none;
    }

    .actions {
        padding: 1rem 1.5rem;
        background: rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid var(--glass-border);
    }

    .result-section {
        width: 100%;
        max-width: 800px;
        animation: slideUp 0.4s ease-out;
    }

    .result-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--glass-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tag {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: rgba(99, 102, 241, 0.2);
        color: #a5b4fc;
    }

    .result-content {
        padding: 1.5rem;
        overflow-x: auto;
    }

    pre {
        white-space: pre-wrap;
        font-family: inherit;
        font-size: 1rem;
        color: var(--color-text-main);
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
