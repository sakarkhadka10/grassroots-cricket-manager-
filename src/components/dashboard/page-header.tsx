type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-1.5">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
