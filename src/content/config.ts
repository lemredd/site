import { z as Validator, defineCollection } from "astro:content";

const valid_subcategories = [
	// Experiences
	"individual",
	"collaborative",
	"certifications",

] as const;
type ValidSubcategory = typeof valid_subcategories[number];
const is_valid_subcategory = (subcategory: string): subcategory is ValidSubcategory => valid_subcategories.indexOf(subcategory as ValidSubcategory) !== -1;
const category_item = Validator.object({
	"item_title": Validator.string(),
	"item_subcategory": Validator.string().refine(is_valid_subcategory),
	"item_link": Validator.string().url().optional()
});

const about = defineCollection({
	"type": "data",
	"schema": Validator.object({
		"category_items": Validator.array(category_item)
	})
});

export const collections = {
	about
};
