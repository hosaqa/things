<script lang="ts">
  import { createForm } from 'felte';
	import { goalsStore } from '../stores/goals';

  const { form, data, unsetField, addField } = createForm({
    initialValues: {
      name: '',
      emoji: '',
      description: '',
      inspectionDate: '',
      images: [{
        url: '',
        description: '',
      }],
    },
    onSubmit: (values, context) => {
      debugger
      goalsStore.add({
        name: values.name,
        emoji: values.emoji ? values.emoji : undefined,
        description: values.description,
        inspectionDate: Math.round(new Date(values.inspectionDate).getTime() / 1000),
        attachedImages: values.images,
      });

      context.reset();
    },
  });

  $: images = $data.images;

  function removeImage(index: number) {
    return () => unsetField(`images.${index}`);
  }

  function addImage() {
    return addField(`images`, { url: '', description: '' }, images.length + 1);
  }
</script>

<form use:form>
  <div class="row">
    <label for="name">Name</label>
    <input name="name" />
  </div>
  <div class="row">
    <label for="description">Description</label>
    <textarea name="description" />
  </div>
  <div class="row">
    <label for="emoji">Emoji</label>
    <input name="emoji" />
  </div>
  <div class="row">
    <label for="inspectionDate">Inspection Date</label>
    <input type="date" name="inspectionDate" />
  </div>
  {#each images as image, index}
    <div class="row">
      <div class="row">
        <label for="images.{index}.url">Image Url</label>
        <input type="text" name="images.{index}.url" />
      </div>
      <div class="row">
        <label for="images.{index}.description">Image Description</label>
        <input type="text" name="images.{index}.description" />
      </div>
      <button type="button" on:click="{removeImage(index)}">
        remove
      </button>
    </div>
  {/each}
  <button class="add-image" type="button" on:click={() => addImage()}>Add another image</button>
  <button type="submit">Add</button>
</form>

<style>
  .row {
    margin: 0 0 16px;
  }

  label {
    display: block;
    margin: 0 0 8px;
  }

  .add-image {
    margin-bottom: 16px;
  }
</style>
