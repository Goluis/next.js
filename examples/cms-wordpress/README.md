# A statically generated blog example using Next.js and WordPress

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/basic-features/pages) feature using [WordPress](https://wordpress.org) as the data source.

## Demo

### [https://next-blog-wordpress.now.sh](https://next-blog-wordpress.now.sh)

### Related examples

- [DatoCMS](/examples/cms-datocms)
- [Sanity](/examples/cms-sanity)
- [TakeShape](/examples/cms-takeshape)
- [Prismic](/examples/cms-prismic)
- [Contentful](/examples/cms-contentful)
- [Blog Starter](/examples/blog-starter)

## How to use

### Using `create-next-app`

Execute [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npm init next-app --example cms-wordpress cms-wordpress-app
# or
yarn create next-app --example cms-wordpress cms-wordpress-app
```

### Download manually

Download the example:

```bash
curl https://codeload.github.com/zeit/next.js/tar.gz/canary | tar -xz --strip=2 next.js-canary/examples/cms-wordpress
cd cms-wordpress
```

## Configuration

### Step 1. Prepare your WordPress site

First, a WordPress site is required before hand, there are many solutions out there that can create help you with this, like [WP Engine](https://wpengine.com/) and [WordPress.com](https://wordpress.com/).

Once the site is ready, you'll need to install the [WPGraphQL](https://www.wpgraphql.com/) plugin, it will add a GraphQL API to your WordPress site, which we'll use to query the posts from this app. Follow the next steps to install it:

- Download the [WPGraphQL repo](https://github.com/wp-graphql/wp-graphql) as a ZIP archive.
- Inside your WordPress admin, go to **Plugins** and then click on **Add New**

![Add new plugin](./docs/plugins-add-new.png)

- Now click in the **Upload Plugin** button at the top of the page, you should be able to upload the WPGraphQL plugin

![Upload new plugin](./docs/plugins-upload-new.png)

- Once the plugin has been added, make sure to activate it too from either the **Activate Plugin** button after that WordPress shows after adding the plugin, or from the **Plugins** page.

![WPGraphQL installed](./docs/plugin-installed.png)

#### Optional: Add WPGraphiQL

The [WPGraphiQL](https://github.com/wp-graphql/wp-graphiql) plugin gives you access to a GraphQL IDE directly from your WordPress Admin, allowing you to inspect and play around with the GraphQL API.

The process to add WPGraphiQL is the same as the one for WPGraphQL, go to the [WPGraphiQL repo](https://github.com/wp-graphql/wp-graphiql), download it, and install it as a plugin in your WordPress site. Once that's done you should be able to access the GraphiQL page in the admin:

![WPGraphiQL page](./docs/wp-graphiql.png)

### Step 2. Populate Content

Inside your WordPress admin, go to **Posts** and start adding new posts:

- We recommend creating at least **2 posts**
- Use dummy data for the content
- Pick an author from your WordPress users
- Add a **Featured Image**, you can download one from [Unsplash](https://unsplash.com/)
- Fill the **Excerpt** field

![New post](./docs/new-post.png)

When you’re done, make sure to **Publish** the posts

> **Note:** Only **public** posts that have been published will be rendered by the app, unless [Preview Mode](/docs/advanced-features/preview-mode.md) is enabled.

### Step 3. Set up environment variables

From the dropdown next to the project name, click **API Keys**.

Create a new API Key with the **Read** permission.

Copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and set `NEXT_EXAMPLE_CMS_WORDPRESS_API_URL` to be the URL to your GraphQL endpoint in WordPress. For example: `https://myapp.wpengine.com/graphql`.

Your `.env.local` file should look like this:

```bash
NEXT_EXAMPLE_CMS_WORDPRESS_API_URL=...

# Only required if you want to enable preview mode
# NEXT_EXAMPLE_CMS_WORDPRESS_AUTH_REFRESH_TOKEN=
# NEXT_EXAMPLE_CMS_WORDPRESS_PREVIEW_SECRET=
```

### Step 4. Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/zeit/next.js/discussions).

### Step 5. Add authentication for Preview Mode

By default, the blog will work with public posts from your WordPress site, private content cannot be retrieved, like unpublished posts and private fields. To have access to unpublished posts you'll need to setup authentication. This is completely optional.

To add [authentication to WPGraphQL](https://docs.wpgraphql.com/guides/authentication-and-authorization/), first you need to add the [WPGraphQL JWT plugin](https://github.com/wp-graphql/wp-graphql-jwt-authentication) to your Wordpress Admin following the same process you used to add the WPGraphQL plugin.

> Adding the WPGraphQL JWT plugin will disable your GraphQL API until you add a JWT secret ([#91](https://github.com/wp-graphql/wp-graphql-jwt-authentication/issues/91))

Once that's done, you'll need to access the WordPress filesystem to add the secret required to validate JWT tokens, for that it's recommended to use SFTP, there are many guides for this, and it may vary depending in your provider. For example:

- [SFTP guide for WP Engine](https://wpengine.com/support/sftp/)
- [SFTP guide for WordPress.com](https://wordpress.com/support/sftp/)

Once you have SFTP access, open `wp-config.php` and add a secret for your JWT:

```php
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'YOUR_STRONG_SECRET' );
```

> You can read more about this in the documentation for [WPGraphQL JWT Authentication](https://docs.wpgraphql.com/extensions/wpgraphql-jwt-authentication/).

Now, you need to get a **refresh token** to make authenticated requests with GraphQL. Make the following GraphQL mutation to your WordPress site:

```graphql
mutation Login {
  login(
    input: {
      clientMutationId: "uniqueId"
      password: "your_password"
      username: "your_username"
    }
  ) {
    refreshToken
  }
}
```

Replace `your_username` with the **username** of an user with the `Administrator` role, and `your_password` with the user's password.

Copy the `refreshToken` returned by the mutation, then open `.env.local`, and make the following changes:

- Uncomment `NEXT_EXAMPLE_CMS_WORDPRESS_AUTH_REFRESH_TOKEN` and set it to be the `refreshToken` you just got
- Uncomment `NEXT_EXAMPLE_CMS_WORDPRESS_PREVIEW_SECRET` and set it to be any random string (ideally URL friendly)

Your `.env.local` file should look like this:

```bash
NEXT_EXAMPLE_CMS_WORDPRESS_API_URL=...

# Only required if you want to enable preview mode
NEXT_EXAMPLE_CMS_WORDPRESS_AUTH_REFRESH_TOKEN=...
NEXT_EXAMPLE_CMS_WORDPRESS_PREVIEW_SECRET=...
```

### Step 6. Try preview mode

On your WordPress admin, create a new post like before. But **do not Publish** it.

Now, if you go to `http://localhost:3000`, you won’t see the post. However, if you enable **Preview Mode**, you'll be able to see the change ([Documentation](/docs/advanced-features/preview-mode.md)).

To enable Preview Mode, go to this URL:

```
http://localhost:3000/api/preview?secret=<secret>&id=<id>
```

- `<secret>` should be the string you entered for `NEXT_EXAMPLE_CMS_WORDPRESS_PREVIEW_SECRET`
- `<id>` should be the post's `databaseId` field, this is the integer that you usually see in the URL (`?post=18`)
- `<slug>` can be used instead of `id`, it's generated based on the title

You should now be able to see this post. To exit Preview Mode, you can click on **Click here to exit preview mode** at the top.

### Step 7. Deploy on Vercel

You can deploy this app to the cloud with [Vercel](https://vercel.com/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

To deploy on Vercel, you need to set the environment variables with **Now Secrets** using [Vercel CLI](https://vercel.com/download) ([Documentation](https://vercel.com/docs/cli#commands/secrets)).

Install [Vercel CLI](https://vercel.com/download), log in to your account from the CLI, and run the following commands to add the environment variables. Replace the values with the corresponding strings in `.env.local`:

```bash
now secrets add next_example_cms_wordpress_api_url <NEXT_EXAMPLE_CMS_WORDPRESS_API_URL>
now secrets add next_example_cms_wordpress_auth_refresh_token <NEXT_EXAMPLE_CMS_WORDPRESS_AUTH_REFRESH_TOKEN>
now secrets add next_example_cms_wordpress_preview_secret <NEXT_EXAMPLE_CMS_WORDPRESS_PREVIEW_SECRET>
```

> If you don't need [Preview Mode](/docs/advanced-features/preview-mode.md), update `vercel.json` to only include `NEXT_EXAMPLE_CMS_WORDPRESS_API_URL`

Then push the project to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) to deploy.