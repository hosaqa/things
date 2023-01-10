<script lang="ts">
  import { createForm } from 'felte';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import { get } from 'svelte/store';
	import { goalsStore } from '../domain/stores/goals';
	import ErrorMessage from './Form/ErrorMessage.svelte';


  type FormValues = {
    name: string;
    emoji: string;
    description: string;
    inspectionDate: string;
    images: {
        url: string;
        description: string;
    }[];
  };

  const { form, data, unsetField, addField } = createForm<FormValues>({
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
    validate: (values) => {
      const errors: Record<string, string | string[]> = {}

      if (!values.name) {
        errors.name = 'Must be filled';
      }

      const goals = get(goalsStore.list);
      const sameNameGoal = goals.find(({ name }) => name === values.name);

      if (!!sameNameGoal) {
        errors.name = `Goal with name ${values.name} already exists`;
      }

      if (!values.emoji) {
        errors.emoji = 'Must be filled';
      }


      if (!values.inspectionDate) {
        errors.inspectionDate = 'Must be filled';
      }

      values.images.forEach((image, index) => {
        if (!image.url) {
          errors[`images.${index}.url`] = 'Must be filled';
        }

        if (!image.description) {
          errors[`images.${index}.description`] = 'Must be filled';
        }
      });
      
      return errors;
    },
    onSubmit: (values, context) => {
      goalsStore.add({
        name: values.name,
        emoji: values.emoji ? values.emoji : undefined,
        description: values.description,
        inspectionDate: new Date(values.inspectionDate),
        attachedImages: values.images,
      });

      context.reset();
    },
    extend: reporter,
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
    <ValidationMessage for="name" let:messages={message}>
      <ErrorMessage>{message || ''}</ErrorMessage>
    </ValidationMessage>
  </div>
  <div class="row">
    <label for="description">Description</label>
    <textarea name="description" />
  </div>
  <div class="row">
    <label for="emoji">Emoji</label>
    <input name="emoji" />
    <ValidationMessage for="emoji" let:messages={message}>
      <ErrorMessage>{message || ''}</ErrorMessage>
    </ValidationMessage>
  </div>
  <div class="row">
    <label for="inspectionDate">Inspection Date</label>
    <input type="date" name="inspectionDate" />
    <ValidationMessage for="inspectionDate" let:messages={message}>
      <ErrorMessage>{message || ''}</ErrorMessage>
    </ValidationMessage>
  </div>
  {#each images as image, index}
    <div class="row">
      <div class="row">
        <label for="images.{index}.url">Image Url</label>
        <input type="text" name="images.{index}.url" />
        <ValidationMessage for="images.{index}.url" let:messages={message}>
          <ErrorMessage>{message || ''}</ErrorMessage>
        </ValidationMessage>
      </div>
      <div class="row">
        <label for="images.{index}.description">Image Description</label>
        <input type="text" name="images.{index}.description" />
        <ValidationMessage for="images.{index}.description" let:messages={message}>
          <ErrorMessage>{message || ''}</ErrorMessage>
        </ValidationMessage>
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
