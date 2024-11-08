type marginProps = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

interface DataProps {
  readonly Time: string;
  readonly Place: number;
  readonly Seconds: number;
  readonly Name: string;
  readonly Year: number;
  readonly Nationality: string;
  readonly Doping: string;
  readonly URL: URL;
}

export type { marginProps, DataProps };
