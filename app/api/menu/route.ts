import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

const initialMenuPanels = [
  {
    key: 'starters',
    title: 'Starters',
    sortOrder: 1,
    bannerNote: 'Perfect for sharing at the table',
    items: [
      { name: 'Cheese Curds', note: 'Cheese curds fried to golden perfection, served with house ranch' },
      { name: 'Parmesan French Fries', note: 'Garlic parmesan coated crispy french fries' },
      { name: 'Crispy Pork Belly Bites', note: 'Kansas City-style sweet & savory rub, toasted sesame seeds' },
      { name: 'Bone-In Wings', note: 'Fried crispy with choice of BBQ, Parmesan Garlic, or Hot Sauce' },
    ],
  },
  {
    key: 'sandwiches',
    title: 'Sandwiches',
    sortOrder: 2,
    bannerNote: 'Served alongside choice of French fries (plain or Parmesan), sweet potato fries, or chips',
    items: [
      { name: 'Classic Club Sandwich', note: 'Ham, turkey, bacon, lettuce, tomato, cheddar & Swiss on toasted white' },
      { name: 'Cheeseburger', note: 'Cheddar, bacon, lettuce, onion, tomato, pickle on a toasted bun' },
      { name: 'Patty Melt', note: 'Grilled onions, pub sauce, Swiss & American cheese on toasted rye' },
      { name: 'Grilled Chicken Sandwich', note: 'Toasted bun with chicken, lettuce, tomato, onion & spread of mayo' },
    ],
  },
  {
    key: 'salads',
    title: 'Dinner Salads',
    sortOrder: 3,
    bannerNote: 'Dressings: Homemade Ranch, Italian, French, Blue Cheese, Honey Mustard, Balsamic Vinaigrette, 1000 Island',
    items: [
      { name: 'Chicken Caesar Salad', note: 'Parmesan, house croutons, Caesar dressing · Fried or Grilled chicken' },
      { name: 'House Salad', note: 'Lettuce, tomatoes, red onion, cheese, croutons · Choice of dressing' },
      { name: 'Chef Salad', note: 'Ham, bacon, cheese, eggs, tomatoes, sweet peppers, croutons' },
    ],
  },
  {
    key: 'pastas',
    title: 'Pastas',
    sortOrder: 4,
    bannerNote: 'Served with garlic bread & choice of side House or Caesar salad',
    items: [
      { name: 'Spaghetti', note: 'Served with your choice of marinara or rich meat sauce' },
      { name: 'Fettuccine Alfredo', note: 'Creamy Alfredo sauce with grilled chicken served over egg noodles' },
      { name: 'Mushroom Ravioli Portabella', note: 'Mushroom-stuffed ravioli, Alfredo sauce, sautéed tomatoes & portabella mushrooms' },
    ],
  },
  {
    key: 'entrees',
    title: 'Entrees',
    sortOrder: 5,
    bannerNote: 'Served with House or Caesar salad, plus one extra side of your choice',
    items: [
      { name: 'Blackened Salmon', note: 'Grilled blackened salmon cooked to perfection' },
      { name: 'Chicken Tenders', note: 'Crispy fried tenders · Choice of sauce: Parmesan garlic, honey spicy, hot, ranch, honey mustard, or pub sauce' },
      { name: 'Grilled Chicken Breast', note: 'Seasoned grilled chicken breast cooked to juicy perfection' },
    ],
  },
  {
    key: 'pizza',
    title: '16" Thin Crust Pizza',
    sortOrder: 6,
    bannerNote: 'Freshly baked 16-inch thin crust pizzas',
    items: [
      { name: 'Deluxe Pizza', note: 'Pepperoni, sausage, onions, green peppers, mushrooms, green olives' },
      { name: 'Meat Lovers Pizza', note: 'Pepperoni, sausage, seasoned beef, Canadian bacon' },
      { name: 'Single Topping 16" Pizza', note: 'Build your own with Beef, Bacon, Sausage, Pepperoni, Veggies & Extra Cheese' },
    ],
  },
  {
    key: 'extras',
    title: 'Sides & Drinks',
    sortOrder: 7,
    bannerNote: 'Complete your meal with our side options and fountain drinks',
    items: [
      { name: 'Kids Meals', note: 'Choice of Kids Spaghetti (with garlic bread), Kids Chicken Strips (with fries/chips), or Kids Quesadilla (with fries/chips) · Includes drink' },
      { name: 'Sides Selection', note: 'Battered French Fries, Sweet Potato Fries, Baked Potato, Stir Fry, Side House Salad, Side Caesar Salad' },
      { name: 'Fountain Soda & Teas', note: 'Pepsi, Pepsi Zero, Dr Pepper, Dr Pepper Zero, Mtn Dew, Code Red, Lemonade, Root Beer, Orange Crush, 7 Up, Sweet & Unsweet Tea' },
    ],
  },
  {
    key: 'cocktails',
    title: 'Signature Cocktails',
    sortOrder: 8,
    bannerNote: 'From a classic Old Fashioned to custom twists — our bartenders craft your favorite drink',
    items: [
      { name: 'New Beginnings', note: 'Bright passionfruit, crisp tequila, and a sparkling toast to what’s next' },
      { name: 'Crème Brûlée Whiskey Sour', note: 'Silky whiskey sour finished with a crisp, caramelized sugar crust · Rich & creamy' },
      { name: 'Hot Honey Old Fashioned', note: 'Featuring Southern Illinois’ Sons of Mitches Whiskey, house hot honey syrup & bitters · Sweet, hot, or extra hot' },
      { name: 'Peach Tea Mule', note: 'Vodka, peach liqueur, house-brewed sweet tea & ginger beer · Southern Illinois staple' },
    ],
  },
]

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    let result = await payload.find({
      collection: 'menu',
      limit: 100,
      sort: 'sortOrder',
    })

    if (result.totalDocs === 0) {
      console.log('[API /api/menu] Auto-seeding menu categories into Payload CMS...')
      for (const panel of initialMenuPanels) {
        await payload.create({
          collection: 'menu',
          data: panel as any,
        })
      }
      result = await payload.find({
        collection: 'menu',
        limit: 100,
        sort: 'sortOrder',
      })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[API /api/menu] Error:', error)
    return NextResponse.json({ docs: [], error: error.message }, { status: 500 })
  }
}
