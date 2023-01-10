<script lang="ts">
  export let images: { url: string; description: string, attachedAt: number }[];

  let hidden = images.map(({ url }) => url);

  function handleClickButton(url: string) {
    const index = hidden.indexOf(url);
    const shouldShow = index !== -1;

    if (shouldShow) {
      hidden.splice(index, 1);
      hidden = hidden;
    } else {
      window.open(url,'_blank');
    }
  }
</script>

<ul>
  {#each images as image}
    <li>
      <button class="image-wrapper" on:click={() => handleClickButton(image.url)}>
        {#if !hidden.includes(image.url)}
          <img src={image.url} alt="some">
        {/if}
      </button>
      <div class="text">{image.description}</div>
      <div class="text"><strong>Added:</strong> {new Date(image.attachedAt).toDateString()}</div>
    </li>
  {/each}
</ul>

<style>
	ul {
    list-style-type: none;
		margin: 0 0 20px;
    padding: 0;
    display: flex;
	}

  li {
    margin-right: 8px;
    font-size: 14px;
    max-width: 160px;
  }

  .image-wrapper {
    display: block;
    border: 0;
    padding: 0;
    height: 160px;
    width: 100%;
    margin-bottom: 8px;
    background-color: antiquewhite;
  }

  img {
    display: block;
    height: inherit;
    width: inherit;
    object-fit: cover;
  }

  .text {
    margin-bottom: 8px;
  }
</style>
