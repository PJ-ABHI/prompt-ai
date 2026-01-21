<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    let { form } = $props<{ form: ActionData }>();

    let loading = $state(false);
    let currentMode = $state("correct");

    import { onMount, onDestroy } from "svelte";

    const options = [
        { value: "correct", label: "Prompt Coach", icon: "✨" },
        { value: "conversation", label: "English Coach", icon: "🗣️" },
    ];

    let promptText = $state("");
    let isListening = $state(false);
    let recognition: any = null;

    function toggleSpeech() {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.stop();
            isListening = false;
        } else {
            recognition.start();
            isListening = true;
        }
    }

    onMount(() => {
        if (
            "webkitSpeechRecognition" in window ||
            "SpeechRecognition" in window
        ) {
            // @ts-ignore
            const SpeechRecognition =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onresult = (event: any) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    // Append with a space if there's already text
                    promptText =
                        promptText + (promptText ? " " : "") + finalTranscript;
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                isListening = false;
            };

            recognition.onend = () => {
                isListening = false;
            };
        }
    });
</script>

<svelte:head>
    <title>PromptAI - Smart Text Assistant</title>
</svelte:head>

<div class="hero">
    <h1>Create & Refine <span class="text-gradient">Content</span></h1>
    <p class="subtitle">Enter a prompt and let our AI handle the rest.</p>
</div>

<div class="workspace">
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
                    bind:value={promptText}
                    placeholder="Enter your text or prompt here..."
                    rows="12"
                    class="input-field"
                    required
                ></textarea>
                <button
                    type="button"
                    class="mic-btn"
                    class:listening={isListening}
                    onclick={toggleSpeech}
                    aria-label="Voice Input"
                    title="Click to speak"
                >
                    {#if isListening}
                        <span class="pulse"></span> 🛑
                    {:else}
                        🎤
                    {/if}
                </button>
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
    {:else}
        <div class="placeholder-section">
            <!-- Optional placeholder for the result side -->
        </div>
    {/if}
</div>

<style>
    .hero {
        text-align: center;
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        line-height: 1.2;
    }

    .text-gradient {
        background: linear-gradient(135deg, #a78bfa, #2563eb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        color: var(--color-text-muted);
        font-size: 1.125rem;
    }

    /* Workspace Split Layout */
    .workspace {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
    }

    @media (min-width: 1024px) {
        .workspace {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
            gap: 2rem;
        }
    }

    .editor-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%; /* Match height */
        min-height: 500px;
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
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    textarea {
        background: transparent;
        border: none;
        resize: none; /* Disable manual resize as we want it to fill */
        font-size: 1.1rem;
        color: #fff;
        height: 100%;
        min-height: 300px;
        flex: 1;
        font-family: "Outfit", sans-serif;
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
        animation: slideUp 0.4s ease-out;
        height: 100%;
        min-height: 500px; /* Match editor min-height */
        display: flex;
        flex-direction: column;
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
        overflow-y: auto;
        flex: 1;
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

    .mic-btn {
        position: absolute;
        bottom: 1.5rem;
        right: 1.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--glass-border);
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 10;
        font-size: 1.2rem;
    }

    .mic-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    .mic-btn.listening {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
        color: #ef4444;
        animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
        0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
    }
</style>
