# Pagination (with shadcn/ui pagination component)

Now we finalize the display of the result (without the real search functionality), before we integrate the search function in the fetching of the results. By using shadcn/ui we also will make use of their pagination component. So let's install it:

```sh
npx shadcn@latest add pagination
```

And then we need to tweak `@components/ui/pagination.tsx` a litte bit, because we want to render a `<Link />` instead of a `<a />`. So we `import { Link, LinkProps } from 'react-router-dom';` and then we need to change the type definition:

```ts
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  LinkProps &
  React.RefAttributes<HTMLAnchorElement>;
```

And the code of the PaginationLink itself (just replace <a> with <Link>).

```ts
const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
);
```

After some playing around with the shadcn/ui Pagination component I've decided to move my pagination to a separate component (and for this project it will be based on the shadcn/ui Pagination component, even if I've failed to get some nice styling - but the main focus is not styling in this project I'll leave it, like it is - and only add it to the issues section).

My pagination component takes in the current page and the numPages as props (so it can decide which buttons should be visible - and/or clickable - in the pagination component, e. g. it makes no sense to display a previous button, when you are on the first page - but I will always show a first page and a last page button, maybe it won't do anything).

As I've mentioned in the main README I switched to a component rendering some buttons instead - my shadcn/ui pagination component is located at `@/components/ui/jobsterPaginationShadcn.tsx`.
