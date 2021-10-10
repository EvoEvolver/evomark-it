<template>
  <div class="reference-list">
    <p
      v-for="(key, index) of citedKeys"
      :key="index"
      :id="'cite-def-' + key"
      class="cite-def"
    >
      {{ index + 1 }}.
      <a :href="this.getEntry(key).url" target="_blank">
        {{ getItemContent(key) }}
      </a>
    </p>
  </div>
</template>

<script>
export default {
  inject: ["pageEnv"],
  data: function () {
    return {
      citedKeys: this.pageEnv.citedKeys,
      bibDict: this.pageEnv.bibDict,
    };
  },
  methods: {
    getEntry(key) {
      let entryItem = this.bibDict[key];
      if (entryItem) return entryItem.entryTags;
      else return null;
    },
    getItemContent(key) {
      let entry = this.getEntry(key);
      if (entry)
        return [
          getDisplayName(entry.author),
          entry.title,
          entry.journal + " (" + entry.year + ")",
        ].join(", ");
      else return key;
    },
  },
};

function getDisplayName(authorStr) {
  let strSplit = authorStr.split("and");
  let authorList = [];
  for (let term of strSplit) {
    let last, first;
    let nameTuple = term.split(",");
    last = nameTuple[0];
    first = nameTuple[1];
    let abbrFirst = [];
    for (let p of first.trim().split("-")) {
      abbrFirst.push(p[0] + ".");
    }
    authorList.push(abbrFirst.join("-") + " " + last.trim());
  }
  return authorList.join(", ");
}
</script>

<style>
</style>