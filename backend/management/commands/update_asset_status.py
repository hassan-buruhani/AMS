from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from asset_app.models import Asset

class Command(BaseCommand):
    help = 'Update asset status to "Need Troubleshoot" for assets older than 3 months'

    def handle(self, *args, **kwargs):
        # Get the current date and subtract 90 days (3 months)
        three_months_ago = timezone.now() - timedelta(days=90)

        # Find all assets in categories Computer, Laptop, Server that are 3 months old and still Active
        assets_to_update = Asset.objects.filter(
            category__in=['COMP', 'LAPT', 'SERV'], 
            asset_status='A',
            Received_date__lte=three_months_ago
        )

        # Update their status to 'Need Troubleshoot'
        updated_count = 0
        for asset in assets_to_update:
            asset.asset_status = 'B'  # Need Troubleshoot
            asset.save()
            updated_count += 1

        # Output the result
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} assets to "Need Troubleshoot"'))
