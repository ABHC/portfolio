<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'isomorphic-dompurify';

	interface Props {
		source: string;
		inline?: boolean;
		allowed_tags?: string[];
		allowed_attr?: string[];
	}

	const DEFAULT_TAGS = [
		'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
		'a', 'code', 'pre',
		'ul', 'ol', 'li',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
		'blockquote', 'hr',
		'img'
	];
	const DEFAULT_ATTR = ['href', 'title', 'target', 'rel', 'src', 'alt'];

	let {
		source,
		inline = false,
		allowed_tags = DEFAULT_TAGS,
		allowed_attr = DEFAULT_ATTR
	}: Props = $props();

	// Render markdown to sanitized HTML. `inline: true` skips block wrappers
	// (no <p>) for short fragments like a tag label.
	const html = $derived.by(() => {
		if (!source) return '';
		const raw = inline
			? (marked.parseInline(source, { async: false, breaks: true }) as string)
			: (marked.parse(source, { async: false, breaks: true }) as string);
		return DOMPurify.sanitize(raw, {
			ALLOWED_TAGS: allowed_tags,
			ALLOWED_ATTR: allowed_attr,
			ADD_ATTR: ['target']
		});
	});
</script>

{#if inline}
	<span class="markdown">{@html html}</span>
{:else}
	<div class="markdown">{@html html}</div>
{/if}

<style>
	.markdown :global(p) {
		margin: 0 0 1em 0;
	}
	.markdown :global(p:last-child) {
		margin-bottom: 0;
	}
	.markdown :global(a) {
		color: var(--spk-accent, currentColor);
		text-decoration: underline;
	}
	.markdown :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.9em;
		padding: 0.1em 0.35em;
		background: var(--spk-tone, rgba(0, 0, 0, 0.06));
	}
	.markdown :global(pre) {
		padding: 1em;
		background: var(--spk-tone, rgba(0, 0, 0, 0.06));
		overflow-x: auto;
	}
	.markdown :global(ul),
	.markdown :global(ol) {
		padding-left: 1.5em;
		margin: 0 0 1em 0;
	}
	.markdown :global(blockquote) {
		margin: 0 0 1em 0;
		padding-left: 1em;
		border-left: 3px solid var(--spk-accent, currentColor);
		font-style: italic;
	}
</style>
