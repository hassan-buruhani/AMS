from django.db import models # type: ignore
from datetime import date, timedelta
from django.utils import timezone #type: ignore

class Office(models.Model):
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    
    def __str__(self):
        return f'{self.name}'

class Division(models.Model):
    name = models.CharField(max_length=100)
    head_of_division = models.CharField(max_length=50)
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name="division")
    
    def __str__(self):
        return f'{self.name}'

class Asset(models.Model):
    CATEGORY = [
       
        ("COMP", "Computer"),
        ("PRIN", "Printer"),
        ("PHOTO", "Photocopy Machine"),
        ("MEZA" , "MEZA"),
        ("KAB", "KABATI"),
        ("KIT", "KITI"),
        ("SOF", "SOFA"),
        ("OTHERS", "Other Accessories"),
    ]
    STATUS = [
        ("A", "Active"),
        ("B", "Need Troubleshoot"),
        ("C", "Inactive"),
    ]
    
    name = models.CharField(max_length=50)
    Manufactured_date = models.DateField(null=True)
    cost = models.PositiveIntegerField()  # Initial cost of the asset
    invoice = models.CharField(max_length=50)
    category = models.CharField(max_length=10, choices=CATEGORY)
    specification = models.CharField(max_length=150, null=True, blank=True)
    model_number = models.CharField(max_length=50, null=True, blank=True)
    Received_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    issue = models.ForeignKey(Division, on_delete=models.CASCADE, related_name="issued_to_division")
    asset_number = models.CharField(max_length=50, blank=True, unique=True)
    status = models.CharField(max_length=1, choices=STATUS, default="A")
    depreciation = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # Depreciation amount
    useful_life = models.IntegerField(default=5)  # Useful life in years, default is 5 years

    def calculate_depreciation(self):
        if self.Received_date is None:
            return 0.0  # Return 0 depreciation if Received_date is None

        years_in_use = (date.today() - self.Received_date.date()).days / 365.25
        annual_depreciation = self.cost / self.useful_life
        total_depreciation = annual_depreciation * years_in_use

        if total_depreciation > self.cost:
            total_depreciation = self.cost

        return round(total_depreciation, 2)

    def current_value(self):
        return self.cost - self.calculate_depreciation()

    def save(self, *args, **kwargs):
        if not self.asset_number:
            # Generate the division code from the first two letters of the division name
            if ( " " in self.issue.name):
                div = self.issue.name.split()
                division_code = ''.join([word[0].upper() for word in div[0:3]])
            else:
                division_code = self.issue.name[0:2]
            # Generate the category code
            category_code = self.category[:4].upper()

            # Calculate the next sequence number
            last_asset = Asset.objects.filter(issue=self.issue, category=self.category).order_by('id').last()
            next_sequence = 1
            if last_asset and last_asset.asset_number:
                last_sequence = int(last_asset.asset_number.split('/')[-1])
                next_sequence = last_sequence + 1

            # Format the asset number as Division/Category/TotalAssets/Sequence
            # total_assets = Asset.objects.filter(issue=self.issue, category=self.category).count() + 1
            self.asset_number = f'MKS/U/{category_code}/{division_code}/{next_sequence}'

        self.depreciation = self.calculate_depreciation()
        super(Asset, self).save(*args, **kwargs)
        
    def evaluate_status(self):
        three_months_ago = timezone.now() - timedelta(minutes=1)
        if self.Received_date <= three_months_ago and self.status == "A":
            self.status = "B"  # Change status to 'Need Troubleshoot'
            self.save()

    def __str__(self):
        return f'{self.name}'
        
class Maintenance(models.Model):
    date = models.DateTimeField(auto_now=True)
    details = models.CharField(max_length=200)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.asset.name}"

