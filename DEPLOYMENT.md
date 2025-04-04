# Deployment Guide for C# Learning Portal

This guide explains how to deploy the C# Learning Portal as a static website.

## Static Export

The application has been configured to export as static HTML files. You can generate these files by running:

```bash
# Build the application with static export enabled
npm run build
```

This will generate a static version of your site in the `out` directory.

## What's Included in the Static Version

- All HTML files for each page
- JavaScript and CSS assets
- Images and other static files
- `.htaccess` file for Apache configuration
- `README.md` with deployment instructions
- SEO assets (robots.txt, sitemap.xml, JSON-LD scripts)

## Deployment Options

### 1. Traditional Web Hosting (cPanel, Apache, Nginx)

#### For Apache Servers:

1. Upload all the files from the `out` directory to your web server's root directory (e.g., `public_html` or `www`).
2. Make sure the `.htaccess` file is included in the upload.
3. Ensure that `mod_rewrite` is enabled on your server.

#### For Nginx Servers:

1. Upload all the files from the `out` directory to your server's root directory.
2. Configure your Nginx server with the following settings:

```nginx
server {
    listen 80;
    server_name cs.mylearningtech.com;
    root /path/to/your/files;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Enable GZIP compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
}
```

### 2. GitHub Pages

1. Create a new GitHub repository.
2. Upload all the files from the `out` directory to your repository.
3. Enable GitHub Pages in your repository settings.
4. Choose the main branch as the source.
5. Create a file named `.nojekyll` in your repository to prevent GitHub from ignoring files that start with an underscore.

### 3. Netlify

1. Create an account on [Netlify](https://www.netlify.com/).
2. Drag and drop the `out` directory to their upload interface.
3. Configure your site settings:
   - Build command: (leave blank, as you've already built the site)
   - Publish directory: (leave blank or specify `.`)
4. Deploy the site.

### 4. Vercel

1. Create an account on [Vercel](https://vercel.com/).
2. Install the Vercel CLI: `npm i -g vercel`.
3. Navigate to the `out` directory: `cd out`.
4. Run: `vercel deploy --name your-site-name`.
5. Follow the on-screen instructions.

### 5. Amazon S3 + CloudFront

1. Create an S3 bucket and enable static website hosting.
2. Upload all files from the `out` directory to your S3 bucket.
3. Set up CloudFront for CDN distribution.
4. Configure error pages to redirect to `/404.html`.

## Important Notes

### Contact Form

The contact form in this static version has been modified to use [Formspree](https://formspree.io/). Before using the contact form, you need to:

1. Create a Formspree account.
2. Create a new form.
3. Update the form endpoint in `src/components/ContactForm.tsx` from `https://formspree.io/f/YOUR_FORM_ID` to your actual Formspree form ID.
4. Rebuild the application after making this change.

### API Routes

This static version does not support server-side functionality or API routes. All dynamic functionality has been configured to work in a client-side only environment.

## SEO Considerations

The static export includes several SEO enhancements that need to be properly configured:

### 1. Update the Sitemap

Edit `sitemap.xml` and replace all instances of `https://cs.mylearningtech.com` with your actual domain name.

### 2. Include SEO Scripts

Make sure to include the SEO-related JavaScript files in your HTML pages. Add the following to the bottom of your HTML files (before the closing `</body>` tag):

```html
<script src="/jsonld-metadata.js"></script>
```

And add this to the `<head>` section:

```html
<script src="/meta-tags.js"></script>
```

### 3. Create Custom Open Graph Images

For better social media sharing, create custom Open Graph images:

1. Create a default image (1200x630px) for social media sharing
2. Save it as `og-image.png` in the root directory
3. Update the image URL in `meta-tags.js` if you're using a different filename or location

### 4. Register with Search Consoles

After deployment, register your site with:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Yandex Webmaster](https://webmaster.yandex.com)

Upload the provided sitemap.xml to each service.

### 5. Analytics Integration

Consider adding Google Analytics or another analytics solution to track user behavior.

## Testing Your Deployment

After deploying, make sure to verify that:

1. All pages load correctly
2. All links work as expected
3. The contact form submits properly
4. All JavaScript functionality works
5. The site is responsive and displays correctly on different devices
6. SEO elements are properly loaded (use tools like Google's Rich Results Test)

## SEO Testing

After deployment, use these tools to verify your SEO implementation:

1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
3. [Google PageSpeed Insights](https://pagespeed.web.dev/)
4. [Bing URL Inspection Tool](https://www.bing.com/webmasters/tools/contentremoval)

## Troubleshooting

- **404 Errors**: Make sure your server is configured to handle client-side routing. The `.htaccess` file or Nginx configuration should handle this.
- **Missing Assets**: Ensure that all files from the `out` directory were uploaded, including the `_next` directory.
- **Form Submission Issues**: Verify that you've correctly set up Formspree or another form handling service.
- **SEO Schema Errors**: Use the [Schema Markup Validator](https://validator.schema.org/) to test your JSON-LD implementation.

## Support

If you encounter any issues with deployment, please refer to the [Next.js Static Export documentation](https://nextjs.org/docs/advanced-features/static-html-export) or reach out to the development team. 