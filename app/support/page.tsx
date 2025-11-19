import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">
            Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground">
          <p className="text-muted-foreground">
            For any issues or feature requests related to the Seminar Hall system,
            please contact the developer:
          </p>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Email:</span> prajwal@ajiet.edu.in
            </p>
            <p>
              <span className="font-medium">Phone:</span> 6282759863
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
